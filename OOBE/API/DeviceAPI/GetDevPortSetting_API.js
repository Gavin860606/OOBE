var fs = require('fs');
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