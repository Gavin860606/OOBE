var fs = require('fs');
module.exports = {
  AddDev(req, res) {
    function cb() {}
    let status = {
      status: null,
    };
    // res.send('url:  ' + req.params.id);
    let devdata = req.body;
    let potocol = req.body.potocol;
    if (potocol == 'modbusRTU') {
      var hwPort = req.body.hwPort;
      delete devdata.potocol;
      delete devdata.hwPort;
    } else {
      var hwPort = 'LAN';
      delete devdata.potocol;
    }
    try {
      fs.readFile('/app/app/config/' + hwPort + '.json', function (err, data) {
        data = JSON.parse(data);
        let bool = true;
        for (let i = 0; i < data.devList.length; i++) {
          if (data.devList[i].devName == devdata.devName) {
            console.log(data.devList[i].devName);
            data.devList[i] = devdata;
            bool = false;
            break;
          }
        }
        if (bool == true) data.devList.push(devdata);
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
