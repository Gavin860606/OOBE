const express = require('express');
const app = express();
var fs = require('fs');
const path = require('path')
var bodyParser = require('body-parser');
const { resolveSoa } = require('dns');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
module.exports = {
  GetDevPort(req, res) {
    let devinfo = {
      status: null,
      devPortSetting: {},
    };

    let devport = req.body.devPort;
    try {
      fs.readFile('/app/app/config/' + devport + '.json', function (err, data) {
        if (err) {
          devinfo.status = 'Fail';
          res.send(devinfo);
          console.log('File Not Found , please check the model name');
          res.end();
        } else {
          devinfo.devPortSetting = JSON.parse(data);
          devinfo.status = 'Success';
          res.send(devinfo);
          res.end();
        }
      });
    } catch (e) {
      console.log(e);
    }
  },
};
function GetDevPort() {
  let devinfo = {
    status: null,
    devPortSetting: {},
  };
  app.post('/GetDevPortSetting', function (req, res) {
    let devport = req.body.devPort;
    try {
      fs.readFile('Config/' + devport + '.json', function (err, data) {
        if (err) {
          devinfo.status = 'Fail';
          res.send(devinfo);
          console.log('File Not Found , please check the model name');
          res.end();
        } else {
          devinfo.devPortSetting = JSON.parse(data);
          devinfo.status = 'Success';
          res.send(devinfo);
          res.end();
        }
      });
    } catch (e) {
      console.log(e);
    }
  });
}
