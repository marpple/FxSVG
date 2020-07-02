const fs = require("fs");
const path = require("path");
const cluster = require("cluster");
const playwright = require("playwright");
const yargs = require("yargs");

const argv = yargs
  .alias("r", "repeat")
  .alias("h", "headless")
  .alias("w", "watch")
  .alias("t", "type")
  .array("type")
  .default("repeat", "1")
  .default("type", ["chromium", "webkit", "firefox"])
  .parse();

const TEST_REPEAT_COUNT = parseInt(argv.repeat, 10);
const TEST_HEADLESS = !!argv.headless;
const TEST_IS_WATCH = !!argv.watch;
const TEST_PAGE_DEFAULT_URL = "http://localhost:8080/test/index.html";
const TEST_PAGE_JSON_URL = "http://localhost:8080/test/index.json.html";
const TEST_BROWSER_TYPE_LIST = argv.type;

const runTest = async (
  {
    url = TEST_PAGE_DEFAULT_URL,
    waitForTests = () => window.FxSVG_TEST_FAILURES != null,
    evaluateTestResults = () => window.FxSVG_TEST_FAILURES === 0,
  } = {},
  page
) => {
  await page.goto(url);
  await page.waitForFunction(waitForTests, { timeout: 0 });
  return page.evaluate(evaluateTestResults);
};

const runTests = async function* ({
  browser_type,
  total_count,
  headless,
  url,
  waitForTests,
  evaluateTestResults,
  checkIsSuccess,
}) {
  const browser = await playwright[browser_type].launch({ headless });
  let [success_count, fail_count] = [0, 0];
  for (let i = 0; i < total_count; i++) {
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    const test_results = await runTest(
      { url, waitForTests, evaluateTestResults },
      page
    );
    if (checkIsSuccess(test_results)) {
      success_count += 1;
    } else {
      fail_count += 1;
    }
    yield {
      total: total_count,
      success: success_count,
      fail: fail_count,
      test_results,
      page,
    };
  }
  return {
    total: total_count,
    success: success_count,
    fail: fail_count,
    browser,
  };
};

const runTestsDefault = async ({ browser_type_list, total_count }) => {
  const reports = [];
  for (const browser_type of browser_type_list) {
    const iter = runTests({
      browser_type,
      total_count,
      headless: false,
      url: TEST_PAGE_DEFAULT_URL,
      waitForTests: () => window.FxSVG_TEST_FAILURES != null,
      evaluateTestResults: () => window.FxSVG_TEST_FAILURES === 0,
      checkIsSuccess: (is_success) => is_success,
    });
    let cur;
    while (((cur = await iter.next()), !cur.done)) {
      const {
        total,
        success,
        fail,
        test_results: is_success,
        page,
      } = cur.value;
      is_success && (await page.close());
      console.log(
        `${browser_type}::[success:${success}][fail:${fail}][total:${total}]`
      );
    }
    const { total, success, fail, browser } = cur.value;
    reports.push({ browser_type, total, success, fail });
    !fail && (await browser.close());
  }
  return reports;
};

const reportTestsDefault = (reports) => {
  console.log("=== REPORT ===");
  for (const { browser_type, total, success, fail } of reports) {
    console.log(
      `${browser_type}::[success:${success}][fail:${fail}][total:${total}]`
    );
  }
};

const runTestsJSON = async ({ browser_type_list, total_count }) => {
  const reports = [];
  for (const browser_type of browser_type_list) {
    const results = [];
    const iter = runTests({
      browser_type,
      total_count,
      headless: true,
      url: TEST_PAGE_JSON_URL,
      waitForTests: () => window.FxSVG_TEST_RESULTS_JSON != null,
      evaluateTestResults: () => window.FxSVG_TEST_RESULTS_JSON,
      checkIsSuccess: ({ stats: { failures } }) => failures === 0,
    });
    let cur;
    while (((cur = await iter.next()), !cur.done)) {
      const { total, success, fail, test_results, page } = cur.value;
      await page.close();
      results.push(test_results);
      console.log(
        `${browser_type}::[success:${success}][fail:${fail}][total:${total}]`
      );
    }
    const { total, success, fail, browser } = cur.value;
    await browser.close();
    reports.push({
      browser_type,
      total,
      success,
      fail,
      results,
    });
    console.log(`${browser_type}::${fail === 0 ? "ALL_SUCCESS" : "FAIL"}`);
  }
  return reports;
};

const reportTestsJSON = (reports) => {
  console.log("=== REPORT ===");
  for (const { browser_type, total, success, fail, results } of reports) {
    console.group(
      `[${browser_type}][success:${success}][fail:${fail}][total:${total}]`
    );

    if (fail === 0) {
      console.log("ALL_SUCCESS");
    } else {
      for (const [index, { failures }] of Object.entries(results)) {
        console.group(`REPEAT #${index + 1}`);
        for (const { fullTitle, err } of failures) {
          console.group(fullTitle);
          console.log(JSON.stringify(err, null, 2));
          console.groupEnd();
        }
        console.groupEnd();
      }
    }

    console.groupEnd();
  }
};

const main = async () => {
  if (TEST_HEADLESS) {
    const reports = await runTestsJSON({
      browser_type_list: TEST_BROWSER_TYPE_LIST,
      total_count: TEST_REPEAT_COUNT,
    });
    reportTestsJSON(reports);
    const total_fail = reports
      .map(({ fail }) => fail)
      .reduce((a, b) => a + b, 0);
    if (total_fail > 0) {
      throw new Error("TESTS ARE FAILED!!!");
    }
    return;
  }

  const reports = await runTestsDefault({
    browser_type_list: TEST_BROWSER_TYPE_LIST,
    total_count: TEST_REPEAT_COUNT,
  });
  reportTestsDefault(reports);
};

if (cluster.isMaster && TEST_IS_WATCH) {
  console.clear();
  let worker = cluster.fork();
  fs.watch(
    path.resolve(__dirname, "../src"),
    { persistent: true, recursive: true, encoding: "utf8" },
    () => {
      worker && worker.kill();
      console.clear();
      worker = cluster.fork();
    }
  );
} else {
  main().catch((error) => {
    console.log("\n");
    console.error(error.message);
    process.exit(1);
  });
}
