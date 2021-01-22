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
  GetPortList(req, res) {
    let PortList = {
      status: null,
      devPortList: [],
    };
    try {
      fs.readdirSync('/app/app/config/').forEach((file) => {
        console.log(file);
        PortList.devPortList.push(file);
      });
      PortList.status = 'success';
      res.send(PortList);
      res.end();
    } catch (e) {
      PortList.status = 'Fail';
      console.log(e);
      res.send(PortList);
      res.end();
    }
  },
};
function GetPortList() {
  let PortList = {
    status: null,
    devPortList: [],
  };
  app.post('/RTU_GWPort', function (req, res) {
    try {
      fs.readdirSync(__dirname+'/config/').forEach((file) => {
        console.log(file);
        PortList.devPortList.push(file);
      });
      PortList.status = 'success';
      res.send(PortList);
      res.end();
    } catch (e) {
      PortList.status = 'Fail';
      console.log(e);
      res.send(PortList);
      res.end();
    }
  });
}
