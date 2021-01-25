var fs = require('fs');
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