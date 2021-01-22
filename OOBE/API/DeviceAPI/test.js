const path = require('path')
var fs = require('fs');

console.log('__dirname：', __dirname)
console.log('__filename：', __filename)
console.log('process.cwd()：', process.cwd())
console.log( path.resolve())

 fs.readFile( path.resolve('OOBE/OOBE/test/LAN.JSON') , function (err, data) {
    console.log(data)
 })
 
