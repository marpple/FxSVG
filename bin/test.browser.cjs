const playwright = require("playwright");
const yargs = require("yargs");

const argv = yargs.alias("r", "repeat").alias("h", "headless").parse();

const TEST_REPEAT_COUNT = argv.repeat == null ? 10 : parseInt(argv.repeat, 10);
const TEST_HEADLESS = !!argv.headless;
const TEST_PAGE_URL = "http://localhost:8080/test";

const BROWSER_TYPE_LIST = ["chromium" /*, "firefox", "webkit"*/];

const runTest = async (browser) => {
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();
  await page.goto(TEST_PAGE_URL);
  await page.waitForFunction(() => window.FxSVG_TEST_FAILURES != null);
  const failures = await page.evaluate(() => window.FxSVG_TEST_FAILURES);
  if (!failures) {
    await page.close();
    return true;
  }
  return false;
};

const runTests = async function* (browser, repeat_count) {
  let fail_count = 0;
  let success_count = 0;
  for (let i = 0; i < repeat_count; i++) {
    const is_success = await runTest(browser);
    if (is_success) {
      success_count += 1;
    } else {
      fail_count += 1;
    }
    yield { total: repeat_count, success: success_count, fail: fail_count };
  }

  return { total: repeat_count, success: success_count, fail: fail_count };
};

(async () => {
  for (const browser_type of BROWSER_TYPE_LIST) {
    const browser = await playwright[browser_type].launch({
      headless: TEST_HEADLESS,
    });
    const iter = runTests(browser, TEST_REPEAT_COUNT);
    let cur;
    while (((cur = await iter.next()), !cur.done)) {
      const { total, success, fail } = cur.value;
      console.log(
        `${browser_type}::[success:${success}][fail:${fail}][total:${total}]`
      );
    }
    const is_all_success = cur.value.total === cur.value.success;
    if (is_all_success) {
      console.log(`${browser_type}::ALL_SUCCESS`);
    }
    if (TEST_HEADLESS || is_all_success) {
      await browser.close();
    }
  }
})();
