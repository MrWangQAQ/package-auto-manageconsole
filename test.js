#!/usr/bin/env node

const packageAutoManageconsole = require('./src/index')
const path = require('path')

packageAutoManageconsole({
  fileName: 'oppo-mobile-platform', // 输出zip 文件名
  staticPath: path.join(__dirname, 'oppo-mobile-platform'), // 需要打包的文件路径
  outputPath: path.join(__dirname) // 输出zip路径
})