const express = require('express');
const app = express();
var fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
module.exports = {
  DelDev(req, res) {
    function cb() {}
    let status = {
      status: null,
    };

    // hwPort:"LAN/COM#"
    //devname:"inverter01"
    var hwPort = req.body.hwPort;
    var devname = req.body.devName;
    try {
      fs.readFile('/app/app/config/' + hwPort + '.json', function (err, data) {
        data = JSON.parse(data);
        console.log(data.devList[0]);
        for (let i = 0; i < data.devList.length; i++) {
          if (data.devList[i].devName == devname) data.devList.splice(i, 1);
        }
        fs.writeFile('/app/app/config/' + hwPort + '.json', JSON.stringify(data), cb);
        status.status = 'Success';
        res.send(status);
        res.end();
      });
    } catch (e) {
      status.status = 'Fail';
      res.send(status);
    }
  },
};

function DelDev() {
  app.post('/DelDev', function (req, res) {
    function cb() {}
    let status = {
      status: null,
    };

    // hwPort:"LAN/COM#"
    //devname:"inverter01"
    var hwPort = req.body.hwPort;
    var devname = req.body.devName;
    try {
      fs.readFile('/home/gavin/桌面/Project/OOBE/API/Config/' + hwPort + '.JSON', function (
        err,
        data,
      ) {
        data = JSON.parse(data);
        console.log(data.devList[0]);
        for (let i = 0; i < data.devList.length; i++) {
          if (data.devList[i].devName == devname) data.devList.splice(i, 1);
        }
        fs.writeFile(
          '/home/gavin/桌面/Project/OOBE/API/Config/' + hwPort + '.JSON',
          JSON.stringify(data),
          cb,
        );
        status.status = 'Success';
        res.send(status);
        res.end();
      });
    } catch (e) {
      status.status = 'Fail';
      res.send(status);
    }
  });
}
