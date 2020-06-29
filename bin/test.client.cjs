const playwright = require("playwright");
const yargs = require("yargs");

const argv = yargs
  .alias("r", "repeat")
  .alias("h", "headless")
  .default("repeat", "10")
  .parse();

const TEST_REPEAT_COUNT = parseInt(argv.repeat, 10);
const TEST_HEADLESS = !!argv.headless;
const TEST_PAGE_DEFAULT_URL = "http://localhost:8080/test/index.html";
const TEST_PAGE_JSON_URL = "http://localhost:8080/test/index.json.html";

const BROWSER_TYPE_LIST = ["chromium" /*, "firefox", "webkit"*/];

const runTest = async (
  {
    url = TEST_PAGE_DEFAULT_URL,
    waitForTests = () => window.FxSVG_TEST_FAILURES != null,
    evaluateTestResults = () => window.FxSVG_TEST_FAILURES === 0,
  } = {},
  page
) => {
  await page.goto(url);
  await page.waitForFunction(waitForTests);
  return page.evaluate(evaluateTestResults);
};

const runTestsDefault = async ({ browser_type_list, total_count }) => {
  const results = [];
  for (const browser_type of browser_type_list) {
    const browser = await playwright[browser_type].launch({
      headless: false,
    });
    let fail_count = 0;
    let success_count = 0;
    for (let i = 0; i < total_count; i++) {
      const context = await browser.newContext({ viewport: null });
      const page = await context.newPage();
      const is_success = await runTest(
        {
          url: TEST_PAGE_DEFAULT_URL,
          waitForTests: () => window.FxSVG_TEST_FAILURES != null,
          evaluateTestResults: () => window.FxSVG_TEST_FAILURES === 0,
        },
        page
      );
      if (is_success) {
        await page.close();
        success_count += 1;
      } else {
        fail_count += 1;
      }

      console.log(
        `${browser_type}::[success:${success_count}][fail:${fail_count}][total:${total_count}]`
      );
    }

    if (fail_count === 0) {
      console.log(`${browser_type}::ALL_SUCCESS`);
      await browser.close();
    } else {
      console.log(`${browser_type}::FAIL`);
    }

    results.push({
      browser_type,
      total: total_count,
      success: success_count,
      fail: fail_count,
    });
  }

  console.log("=== REPORT ===");
  console.log(
    results
      .map(
        ({ browser_type, total, success, fail }) =>
          `${browser_type}::[success:${success}][fail:${fail}][total:${total}]`
      )
      .join("\n")
  );
};

const runTestsJSON = async ({ browser_type_list, total_count }) => {
  const reports = [];

  for (const browser_type of browser_type_list) {
    const browser = await playwright[browser_type].launch({
      headless: true,
    });
    let fail_count = 0;
    let success_count = 0;
    const results = [];
    for (let i = 0; i < total_count; i++) {
      const context = await browser.newContext({ viewport: null });
      const page = await context.newPage();
      const test_results = await runTest(
        {
          url: TEST_PAGE_JSON_URL,
          waitForTests: () => window.FxSVG_TEST_RESULTS_JSON != null,
          evaluateTestResults: () => window.FxSVG_TEST_RESULTS_JSON,
        },
        page
      );
      await page.close();
      results.push(test_results);

      if (test_results.stats.failures === 0) {
        success_count += 1;
      } else {
        fail_count += 1;
      }

      console.log(
        `${browser_type}::[success:${success_count}][fail:${fail_count}][total:${total_count}]`
      );
    }

    await browser.close();
    if (fail_count === 0) {
      console.log(`${browser_type}::ALL_SUCCESS`);
    } else {
      console.log(`${browser_type}::FAIL`);
    }

    reports.push({
      browser_type,
      total: total_count,
      success: success_count,
      fail: fail_count,
      results,
    });
  }

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

  if (reports.map(({ fail }) => fail).reduce((a, b) => a + b, 0) > 0) {
    process.exit(1);
  }
};

(async () => {
  if (TEST_HEADLESS) {
    await runTestsJSON({
      browser_type_list: BROWSER_TYPE_LIST,
      total_count: TEST_REPEAT_COUNT,
    });
    return;
  }

  await runTestsDefault({
    browser_type_list: BROWSER_TYPE_LIST,
    total_count: TEST_REPEAT_COUNT,
  });
})();
