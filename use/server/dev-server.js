const config = require("../bundle/webpack.config"); 
const express = require('express');
const app = express();
const webpack = require("webpack");

// 当前的环境是开发环境
// 修改入口文件,用于热更新通信
config.entry.index = ["webpack-hot-middleware/client", config.entry.index];
// 用与生成热更新的 lastHash.hot-update.json 和 chunkID.lastHash.hot-update.js
config.plugins.push(new webpack.HotModuleReplacementPlugin());
// 准备好热更新的环境之后开始编译
const compiler = webpack(config);
// webpack-dev-middleware 是一个封装器(wrapper)，它可以把 webpack 处理过的文件发送到一个 server。
const devMiddleware = require("webpack-dev-middleware")(compiler, {
    publicPath: config.output.publicPath,
    serverSideRender: true 
});

app.use(devMiddleware)

app.use(require("webpack-hot-middleware")(compiler));
compiler.hooks.done.tap("done", stats => {
    const info = stats.toJson();
    if (stats.hasWarnings()) {
        console.warn(info.warnings);
    }

    if (stats.hasErrors()) {
        console.error(info.errors);
        return;
    }
    // 通知客户端已经打包完成了，可以往下走了
    console.log("打包完成");
    // update();
});

app.listen(9527, () => {
    console.log("Your app is running", 9527);
});

