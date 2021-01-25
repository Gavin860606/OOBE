var fs = require('fs');
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