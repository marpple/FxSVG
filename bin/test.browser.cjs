const playwright = require("playwright");

const TEST_REPEAT_COUNT =
  process.argv[2] == null ? 10 : parseInt(process.argv[2], 10);
const TEST_PAGE_URL = "http://localhost:8080/test";

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

const runTests = async (browser_type, repeat_count) => {
  const browser = await playwright[browser_type].launch({ headless: false });

  let fail_count = 0;
  let success_count = 0;
  for (let i = 0; i < repeat_count; i++) {
    const is_success = await runTest(browser);
    if (is_success) {
      success_count += 1;
    } else {
      fail_count += 1;
    }
    console.log(
      `${browser_type}::[success:${success_count}][fail:${fail_count}][total:${repeat_count}]`
    );
  }

  if (!fail_count) {
    await browser.close();
    console.log(`${browser_type}::ALL_SUCCESS`);
  }
};

(async () => {
  for (const browser_type of ["chromium" /*, "firefox", "webkit"*/]) {
    await runTests(browser_type, TEST_REPEAT_COUNT);
  }
})();
