import fs from "fs";
import path from "path";
import { Readable } from "stream";
import url from "url";
import webpack from "webpack";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

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
