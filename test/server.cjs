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
      entry: "./spec.js",
      output: {
        filename: "spec.bundle.js",
      },
    })
  )
);

app.listen(8080, () => console.log("TEST SERVER LISTENING ON 8080 PORT"));
