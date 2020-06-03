const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const webpack = require("webpack");

const BROWSER_INDEX_FILENAME = "browser_index";

(async () => {
  fs.rmdirSync(path.resolve(__dirname, "../dist"), {
    recursive: true,
    maxRetries: 10,
    retryDelay: 300,
  });
  fs.mkdirSync(path.resolve(__dirname, "../dist"));

  const browser_index_js = `
import $$ from "../src/index.js";
window.$$ = $$;
`.trimStart();
  Readable.from([browser_index_js]).pipe(
    fs.createWriteStream(
      path.resolve(__dirname, `../dist/${BROWSER_INDEX_FILENAME}.js`),
      {
        flags: "w",
      }
    )
  );

  await new Promise((resolve, reject) =>
    webpack(
      {
        mode: "production",
        context: path.resolve(__dirname, "../"),
        entry: `./dist/${BROWSER_INDEX_FILENAME}.js`,
        output: {
          filename: "fxsvg.js",
          path: path.resolve(__dirname, "../dist"),
        },
      },
      (error, stats) => {
        if (error) {
          return reject(error);
        }

        const info = stats.toJson("verbose");

        if (stats.hasErrors()) {
          const error = new Error(JSON.stringify(info, null, 2));
          return reject(error);
        }

        resolve(info);
      }
    )
  );

  fs.unlinkSync(
    path.resolve(__dirname, `../dist/${BROWSER_INDEX_FILENAME}.js`)
  );
})();
