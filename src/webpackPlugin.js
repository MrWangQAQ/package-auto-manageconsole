'use strict';
const packageAutoManageconsole = require('./index')
const path = require('path')

function webpackPlugin(options) {
	this.options = options || {};
}

webpackPlugin.prototype.apply = function(compiler) {
	const options = this.options
	compiler.hooks.afterEmit.tapAsync(webpackPlugin.name, function(compilation, callback) {
        packageAutoManageconsole({
            fileName: options.fileName, // 输出zip 文件名
            staticPath: options.staticPath, // 需要打包的文件路径
            outputPath: options.outputPath // 输出zip路径
        })
		callback()
	})
};

module.exports = webpackPlugin;
