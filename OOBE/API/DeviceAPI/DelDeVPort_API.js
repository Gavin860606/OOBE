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
  DelDevPort(req, res) {
    let devinfo = {
      status: null,
    };
    let devport = req.body.devPort;
    try {
      fs.unlink('/app/app/config/' + devport + '.JSON', (err) => {
        if (err) {
          console.error(err);
          devinfo.status = 'Fail';
          res.send(devinfo);
        } else {
          devinfo.status = 'Success';
          res.send(devinfo);
        }
      });
    } catch (e) {
      console.log(e);
    }
  },
};
function DelDevPort() {
  let devinfo = {
    status: null,
  };
  app.post('/DelDevPort', function (req, res) {
    let devport = req.body.devPort;
    try {
      fs.unlink('/home/gwsapltpv500/docker-test/OOBE/OOBE/config/' + devport + '.JSON', (err) => {
        if (err) {
          console.error(err);
          devinfo.status = 'Fail';
          res.send(devinfo);
        } else {
          devinfo.status = 'Success';
          res.send(devinfo);
        }
      });
    } catch (e) {
      console.log(e);
    }
  });
}
