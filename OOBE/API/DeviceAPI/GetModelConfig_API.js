const express = require('express');
const app = express();
var fs = require('fs');
const path = require('path')
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
module.exports = {
  GetModelConfig(req, res) {
    let modelConfig = {
      status: null,
      modelConfig: {},
    };
    // res.send('url:  ' + req.params.id);
    let modelName = req.body.modelname;
    try {
      fs.readFile('/app/app/API/DeafultConfig/' + modelName + '.JSON', function (err, data) {
        if (err) {
          modelConfig.status = 'Fail';
          res.send(modelConfig);
          console.log('File Not Found , please check the model name');
          res.end();
        } else {
          modelConfig.modelConfig = JSON.parse(data);
          modelConfig.status = 'Success';
          res.send(modelConfig);
          res.end();
        }
      });
    } catch (e) {
      console.log(e);
    }
  },
};

function GetModelConfig() {
  let modelConfig = {
    status: null,
    modelConfig: {},
  };
  app.post('/GetModelConfig', function (req, res) {
    // res.send('url:  ' + req.params.id);
    let modelName = req.body.modelname;
    try {
      fs.readFile('DeafultConfig/' + modelName + '.JSON', function (err, data) {
        if (err) {
          modelConfig.status = 'Fail';
          res.send(modelConfig);
          console.log('File Not Found , please check the model name');
          res.end();
        } else {
          modelConfig.modelConfig = JSON.parse(data);
          modelConfig.status = 'Success';
          res.send(modelConfig);
          res.end();
        }
      });
    } catch (e) {
      console.log(e);
    }
  });
}
