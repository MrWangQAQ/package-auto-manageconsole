const toCompress = require('./lib/toCompress')
const fs = require("fs")
const crypto = require('crypto')
const delDir = require('./lib/deleteFile')
const webpackPlugin = require('./webpackPlugin')

function packageAutoManageconsole ({fileName, staticPath, outputPath}) {
  if (!fileName) {
    console.error('fileName 为空！')
    return
  }
  const limitFileName = `${fileName}_limit`
  const limitFilePath = `${outputPath}/${limitFileName}`
  fs.access(limitFilePath, fs.constants.F_OK, (err) => {
    if (!err) {
      delDir(limitFilePath)
    }
    // 创建limitFile
    fs.mkdirSync(limitFilePath)
    // 创建config
    fs.mkdirSync(`${limitFilePath}/config`)
    toCompress({
      fileName,
      outputPath: limitFilePath,
      staticPath
    }).then(compressContent => {
      const md5 = crypto.createHash('md5')
      const compressMd5 = md5.update(compressContent).digest('hex')
      const md5sum = fs.createWriteStream(`${limitFilePath}/md5sum.txt`)
      md5sum.write(`${compressMd5} ${fileName}.zip`)
      md5sum.close()
      toCompress({
        fileName,
        outputPath,
        staticPath: limitFilePath
      })
      .then(() => {
        console.log('\x1B[32m%s\x1B[39m', '✅ 客开部署zip包生成成功！')
        delDir(limitFilePath)
      })
      .catch(() => {
        delDir(limitFilePath)
      })
    })
  })
}

module.exports = packageAutoManageconsole
module.exports.webpackPlugin = webpackPlugin(packageAutoManageconsole)