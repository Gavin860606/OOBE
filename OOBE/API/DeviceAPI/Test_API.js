const express = require('express');
const app = express();
var fs = require('fs');
var Modbus = require('modbus-serial');
var bodyParser = require('body-parser');
const path = require('path');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
var status = {
  status: null,
};
module.exports = {
  TestTCPAPI(req, res) {
    function ConnectTCP(ip, port, uid) {
      return new Promise((resolve, reject) => {
        let client = new Modbus();
        // open connection to a serial port
        client.setID(uid);
        client
          .connectTCP(ip, { port: port })
          .then((result) => {
            console.log('Connect TCP succeed:', 'ip:', ip, 'port', port);
            status.status = `Connect TCP succeed:', 'ip:', ${ip}, 'port', ${port}`;
            res.send(status);
            res.end();
            resolve(client);
          })
          .catch((err) => {
            status.status = 'TCP connection failed';
            res.send(status);
            res.end();
            reject('TCP connection failed');
          });
      });
    }
    async function testTCP(data) {
      try {
        await ConnectTCP(data.ip, data.port, data.uid);
      } catch (e) {
        console.log('Failed');
      }
    }
    let data = req.body;
    testTCP(data);
  },
  TestRTUAPI(req, res) {
    function ConnectRTU(hwPort, baudRate, SlaveId) {
      return new Promise((resolve, reject) => {
        var ModbusRTU = require('modbus-serial');
        let client = new ModbusRTU();
        // open connection to a serial port
        client.setID(SlaveId);
        client
          .connectRTUBuffered(hwPort, { baudRate: baudRate })
          .then((result) => {
            status.status = `Connect RTU succeed:', 'portocol:', ${hwPort}, 'baudRate', ${baudRate}`;
            console.log(
              'Connect RTU succeed:',
              'portocol:',
              hwPort,
              'baudRate:',
              baudRate,
              'address:',
            );
            client.close();
            res.send(status);
            res.end();
            resolve(client);
          })
          .catch((err) => {
            status.status = 'RTU connection failed';
            res.send(status);
            res.end();
            reject('RTU connection failed');
            console.log(err);
          });
      });
    }
    async function testRTU(data) {
      try {
        await ConnectRTU(data.hwPort, data.baudRate, data.SlaveId);
        //await ConnectTCP(data.ip, data.port, data.UnitId);
      } catch (e) {
        console.log('Failed');
        console.log('\n' + e);
      }
    }

    let data = req.body;
    testRTU(data);
  },
};

function TestTCPAPI() {
  function ConnectTCP(ip, port, uid) {
    return new Promise((resolve, reject) => {
      let client = new Modbus();
      // open connection to a serial port
      client.setID(uid);
      client
        .connectTCP(ip, { port: port })
        .then((result) => {
          console.log('Connect TCP succeed:', 'ip:', ip, 'port', port);
          resolve(client);
        })
        .catch((err) => {
          reject('TCP connection failed');
        });
    });
  }
  async function testTCP(data) {
    try {
      await ConnectTCP(data.ip, data.port, data.UnitId);
    } catch (e) {
      console.log('Failed');
    }
  }
  app.post('/TestTCP', function (req, res) {
    let data = req.body;
    testTCP(data);
    res.end();
  });
}
function TestRTUAPI() {
  function ConnectRTU(hwPort, baudRate, SlaveId) {
    return new Promise((resolve, reject) => {
      var ModbusRTU = require('modbus-serial');
      let client = new ModbusRTU();
      // open connection to a serial port
      client.setID(SlaveId);
      client
        .connectRTUBuffered(hwPort, { baudRate: baudRate })
        .then((result) => {
          console.log(
            'Connect RTU succeed:',
            'portocol:',
            hwPort,
            'baudRate:',
            baudRate,
            'address:',
          );
          resolve(client);
        })
        .catch((err) => {
          reject('RTU connection failed');
        });
    });
  }
  async function testRTU(data) {
    try {
      await ConnectRTU(data.hwPort, data.baudRate, data.SlaveId);
      //await ConnectTCP(data.ip, data.port, data.UnitId);
    } catch (e) {
      console.log('Failed');
    }
  }
  app.post('/TestRTU', function (req, res) {
    let data = req.body;
    testRTU(data);
    res.end();
  });
}
