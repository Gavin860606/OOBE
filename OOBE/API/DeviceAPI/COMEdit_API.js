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
  COMEdit(req, res) {
    function cb() {}
    let status = {
      status: null,
    };
    // res.send('url:  ' + req.params.id);
    let setting = req.body;
    let hwPort = req.body.hwPort;
    try {
      fs.readFile('/app/app/config/' + hwPort + '.json', function (err, data) {
        data = JSON.parse(data);
        let bool = true;
        data.settings = setting;
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
function COMEdit() {
  function cb() {}
  let status = {
    status: null,
  };
  app.post('/COMEdit', function (req, res) {
    // res.send('url:  ' + req.params.id);
    let setting = req.body;
    let hwPort = req.body.hwPort;
    try {
      fs.readFile('/home/gwsapltpv500/docker-test/OOBE/OOBE/config/' + hwPort + '.json', function (
        err,
        data,
      ) {
        data = JSON.parse(data);
        let bool = true;
        data.settings = setting;
        fs.writeFile(
          '/home/gwsapltpv500/docker-test/OOBE/OOBE/config/' + hwPort + '.json',
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
