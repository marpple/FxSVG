const path = require("path");
const express = require("express");
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const config = require("./webpack.test.config.cjs");

const app = express();
app.use(express.static(path.resolve(__dirname, "../")));
app.use("/webpack", middleware(webpack(config)));

app.listen(8080, () => console.log("TEST SERVER LISTENING ON 8080 PORT"));
