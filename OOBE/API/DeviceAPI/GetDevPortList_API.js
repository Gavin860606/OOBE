var fs = require('fs');
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

