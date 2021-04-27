const archiver = require('archiver')
const fs = require("fs")
const path = require('path')

function toCompress ({fileName, type = 'zip', outputPath, staticPath = ''}) {
  return new Promise((reslove, reject) => {
    const output = fs.createWriteStream(`${path.join(outputPath, fileName)}.${type}`)
    const archive = archiver(type, {
      zlib: { level: 9 }
    })

    // 文件输出流结束
    output.on('close', function() {
      const compressContent = fs.readFileSync(`${path.join(outputPath, fileName)}.${type}`)
      reslove(compressContent)
    })

    // 数据源是否耗尽
    output.on('end', function() {
      console.log('数据源已耗尽')
    })

    // 存档警告
    archive.on('warning', function(err) {
      console.log(err)
      if (err.code === 'ENOENT') {
        console.warn('stat故障和其他非阻塞错误')
      } else {
        reject(err)
        throw err
      }
    })

    // 存档出错
    archive.on('error', function(err) {
      console.log(err)
      reject(err)
      throw err
    })

    archive.pipe(output)

    archive.directory(`${staticPath}/`, false)

    archive.finalize()
  })
}

module.exports = toCompress