const path = require("path");
const express = require("express");
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const yargs = require("yargs");

const argv = yargs.alias("p", "port").default("port", "8080").parse();
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
