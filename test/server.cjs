const path = require("path");
const express = require("express");
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");

const app = express();
app.use(express.static(path.resolve(__dirname, "../")));
app.use(
  "/test",
  middleware(
    webpack({
      mode: "development",
      context: __dirname,
      entry: "./run_tests_in_browser.js",
      output: {
        filename: "run_tests_in_browser.bundle.js",
      },
    })
  )
);
app.get("/", (req, res) => res.redirect("/test"));

app.listen(8080, () => console.log("TEST SERVER LISTENING ON 8080 PORT"));
