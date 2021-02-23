import express from "express";
import path from "path";
import url from "url";
import webpack from "webpack";
import middleware from "webpack-dev-middleware";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const argv = yargs(hideBin(process.argv))
  .alias("p", "port")
  .default("port", "8080")
  .parse();
const port = parseInt(argv.port, 10);

const app = express();
app.use(express.static(path.resolve(__dirname, "../")));
app.use(
  "/test",
  middleware(
    webpack({
      mode: "development",
      context: __dirname,
      entry: {
        run_tests_in_browser: "./run_tests_in_browser.js",
        mount_fxsvg_in_browser: "./mount_fxsvg_in_browser.js",
      },
      output: {
        filename: "[name].bundle.js",
      },
    })
  )
);
app.get("/", (req, res) => res.redirect("/test"));

app.listen(port, () => console.log(`TEST SERVER LISTENING ON ${port} PORT`));
