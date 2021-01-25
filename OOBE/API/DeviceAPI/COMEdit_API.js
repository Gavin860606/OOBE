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
