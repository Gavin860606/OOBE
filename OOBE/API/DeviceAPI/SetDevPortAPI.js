const express = require('express');
const app = express();
var fs = require('fs');
var Modbus = require('modbus-serial');
const path = require('path');
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
module.exports = {
  SetDevPort(req, res) {
    let status = {
      status: null,
      portocol: null,
    };
    function cb() {}

    function AddLANConfig() {
      fs.writeFile('/app/app/config/LAN.json', JSON.stringify(LANobj), cb);
    }

    function AddCOMConfig(filename) {
      return new Promise((res, rej) => {
        try {
          fs.writeFile(filename, JSON.stringify(COMobj), cb);
          res();
        } catch (err) {
          rej(err);
        }
      });
    }

    let LANobj = {
      potocol: 'modbusTCP',
      devList: [],
    };
    let COMobj = {
      potocol: 'modbusRTU',
      settings: {},
      devList: [],
    };

    // res.send('url:  ' + req.params.id);
    let COM = req.body;
    let filename = '/app/app/config/' + COM.hwPort + '.json';
    try {
      AddCOMConfig(filename).then(() => {
        //CREATE　LAN CONFIG
        AddLANConfig();
        fs.readFile(filename, function (err, data) {
          data = JSON.parse(data);
          data.settings.hwPort = COM.hwPort;
          data.settings.baudRate = COM.baudRate;
          data.settings.communicationFormat = COM.communicationFormat;
          fs.writeFile(filename, JSON.stringify(data), cb);
          status.status = 'Succeed';
          status.portocol = COM.hwPort;
          res.send(status);
          res.end();
        });
      });
    } catch (e) {
      status.status = 'Failed';
      res.send(status);
    }
  },
};
function SetDevPort() {
  function cb() {}

  function AddLANConfig() {
    fs.writeFile('Config/LAN.JSON', JSON.stringify(LANobj), cb);
  }

  function AddCOMConfig(filename) {
    return new Promise((res, rej) => {
      try {
        fs.writeFile(filename, JSON.stringify(COMobj), cb);
        res();
      } catch (err) {
        rej(err);
      }
    });
  }

  let LANobj = {
    potocol: 'modbusTCP',
    devList: [],
  };
  let COMobj = {
    potocol: 'modbusRTU',
    settings: {},
    devList: [],
  };

  app.post('/COMSettings', function (req, res) {
    // res.send('url:  ' + req.params.id);
    let COM = req.body;
    let filename = 'Config/' + COM.hwPort + '.JSON';
    try {
      AddCOMConfig(filename).then(() => {
        //CREATE　LAN CONFIG
        AddLANConfig();
        fs.readFile(filename, function (err, data) {
          data = JSON.parse(data);
          data.settings.hwPort = COM.hwPort;
          data.settings.baudRate = COM.settings.baudRate;
          data.settings.communicationformat = COM.settings.communicationformat;
          fs.writeFile(filename, JSON.stringify(data), cb);
          res.send(data);
          res.end();
        });
      });
    } catch (e) {
      res.send('try again');
    }
  });
}
