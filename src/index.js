const toCompress = require('./lib/toCompress')
const fs = require("fs")
const crypto = require('crypto')
const delDir = require('./lib/deleteFile')
const path = require('path')

function packageAutoManageconsole ({fileName, staticPath, outputPath}) {
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
      md5sum.write(`${compressMd5} ${fileName}`)
      md5sum.close()
      toCompress({
        fileName,
        outputPath,
        staticPath: limitFilePath
      })
      .then(() => {
        delDir(limitFilePath)
      })
      .catch(() => {
        delDir(limitFilePath)
      })
    })
  })
}

packageAutoManageconsole({
  fileName: 'oppo-mobile-platform',
  staticPath: path.join(__dirname, '../..', 'oppo-mobile-platform'),
  outputPath: path.join(__dirname, '../..')
})

module.exports = packageAutoManageconsole