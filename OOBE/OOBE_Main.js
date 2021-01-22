const express = require('express');
const app = express();
const path = require('path');
var fs = require('fs');
var Modbus = require('modbus-serial');
var AddDev = require('./API/DeviceAPI/AddDev_API');
var DelDev = require('./API/DeviceAPI/DelDev_API ');
var DelDevPort = require('./API/DeviceAPI/DelDeVPort_API');
var GetDevPortList = require('./API/DeviceAPI/GetDevPortList_API');
var GetDevPortSetting = require('./API/DeviceAPI/GetDevPortSetting_API');
var GetModelConfig = require('./API/DeviceAPI/GetModelConfig_API');
var setDevPort = require('./API/DeviceAPI/SetDevPortAPI');
var TestAPI = require('./API/DeviceAPI/Test_API');
var COMEdit = require('./API/DeviceAPI/COMEdit_API');
var SetInternet = require('./API/NetworkAPI/SetStaticInternet');
var bodyParser = require('body-parser');
const { resolveSoa } = require('dns');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.listen(3000);

app.post('/AddDev', function (req, res) {
  AddDev.AddDev(req, res);
});
app.post('/DelDev', function (req, res) {
  DelDev.DelDev(req, res);
});
app.post('/DelDevPort', function (req, res) {
  DelDevPort.DelDevPort(req, res);
});
app.post('/RTU_GWPort', function (req, res) {
  GetDevPortList.GetPortList(req, res);
});
app.post('/GetDevPortSetting', function (req, res) {
  GetDevPortSetting.GetDevPort(req, res);
});
app.post('/GetModelConfig', function (req, res) {
  GetModelConfig.GetModelConfig(req, res);
});
app.post('/COMSettings', function (req, res) {
  setDevPort.SetDevPort(req, res);
});
app.post('/TestTCP', function (req, res) {
  TestAPI.TestTCPAPI(req, res);
});
app.post('/TestRTU', function (req, res) {
  TestAPI.TestRTUAPI(req, res);
});
app.post('/SetInternet', function (req, res) {
  SetInternet.SetInternet(req, res);
});
app.post('/COMEdit', function (req, res) {
  COMEdit.COMEdit(req, res);
});
app.post('/RunModbus', function (req, res) {
  Data = {
    cat: [
      {
        catlog: 'inverter',
        devList: [],
      },
      {
        catlog: 'battery',
        devList: [],
      },
      {
        catlog: 'sensor',
        devList: [],
      },
      {
        catlog: 'meter',
        devList: [],
      },
    ],
  };
  fs.readdir(__dirname + '/config', (err, files) => {
    FileLen = files.length;
  });
  FileChange(__dirname + '/config');
  res.end();
});

var ConfigReader = require('./modbus/ReadConfig');
var ModbusConnect = require('./modbus/ModbusConnect');
var ModbusFormat = require('./modbus/ModbusFormat');
//var convert = require("./ModbusFormat")
var chokidar = require('chokidar');
const Test_API = require('./API/DeviceAPI/Test_API');
var Data = {};
var http = require('http');
function Socket(data) {
  var server = http.createServer(function (request, response) {
    console.log('Connection');
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(JSON.stringify(data));
    response.end();
  });
  server.listen(8001);
}
//FileChange(__dirname+'/config');
var FileLen;
var count = 0;

function FileChange(FolderPath) {
  var watcher = chokidar.watch(FolderPath, { ignored: /^\./, persistent: true });

  watcher

    .on('add', function (path) {
      try {
        asyncRead(path).then((config) =>
          ReadModbusData(config).then(console.log('File: ', path, '\n', config)),
        );
      } catch (err) {
        console.log(err);
      }
    })
    .on('change', function (path) {
      console.log('File', path, 'has been changed');
    })
    .on('unlink', function (path) {
      console.log('File', path, 'has been removed');
    })
    .on('error', function (error) {
      console.error('Error happened', error);
    });
}

//console.log(ConfigReader.ReadFile("/home/gwsapltpv500/test/modbusTest/config/exConfig.json"));
//ConfigReader.ReadPromise("/home/gwsapltpv500/test/modbusTest/config/exConfig.json")

function asyncRead(path) {
  return new Promise(async (resolve, reject) => {
    let readconfig = await ConfigReader.ReadPromise(path);
    resolve(readconfig);
  });
}

class Clients {
  constructor() {
    this.client;
  }
}

function RTUPortDetect(config) {
  switch (config.settings.hwPort) {
    case 'COM1':
      config.settings.hwPort = '/dev/ttyS0';
      break;
    case 'COM2':
      config.settings.hwPort = '/dev/ttyS1';
      break;
    case 'COM3':
      config.settings.hwPort = '/dev/ttyS2';
      break;
    case 'COM4':
      config.settings.hwPort = '/dev/ttyS3';
      break;
  }
}

function CreateTmpConfig(DeviceList, config) {
  DeviceList['hwPort'] = config.settings.hwPort;
  DeviceList['baudRate'] = config.settings.baudRate;
  DeviceList['communicationFormat'] = config.settings.communicationFormat;
  return DeviceList;
}

async function ReadModbusData(config) {
  if (config.potocol == 'modbusRTU') {
    RTUPortDetect(config);
    let client = await ModbusConnect.ConnectRTU(config.settings.hwPort, config.settings.baudRate);
    for (let i = 0; i < Object.keys(config.devList).length; i++) {
      let tmpConfig = CreateTmpConfig(config.devList[i], config);
      await readRTU(tmpConfig, client).then(() => {
        console.log('FINAL DATA:', Data);
        fs.writeFileSync(__dirname + '/Data.txt', JSON.stringify(Data));
      });
    }
    client.close();
  } else if (config.potocol == 'modbusTCP') {
    for (let i = 0; i < Object.keys(config.devList).length; i++) {
      ModbusConnect.ConnectTCP(
        config.devList[i].ip,
        config.devList[i].ipPort,
        config.devList[i].unitId,
      ).then((client) => {
        let tmpConfig = config.devList[i];
        readTCP(tmpConfig, client).then(() => {
          //console.log('FINAL DATA:', Data);
          fs.writeFileSync(__dirname + '/Data.txt', JSON.stringify(Data));
        });
      });
    }
  }
  count++;
  if (count == FileLen) {
    console.log('FINAL DATA:', Data);
    //Socket(JSON.stringify(DataSocket));
    Socket(Data);
  }
  //function cb(){};
}

function type(type) {
  switch (type) {
    case 'u32':
      numOfRegs = 2;
      break;
    case 's32':
      numOfRegs = 2;
      break;
    case 'float':
      numOfRegs = 2;
      break;
    default:
      numOfRegs = 1;
      break;
  }
  return numOfRegs;
}
async function ReadData(client, tmpConfig, RTUorTCP) {
  for (let j = 0; j < Object.keys(tmpConfig.regList).length; j++) {
    let numOfRegs = type(tmpConfig.regList[j].type);
    try {
      if (RTUorTCP == true)
        try {
          client.setID(tmpConfig.slaveId);
        } catch (err) {}
      let data = await client.readHoldingRegisters(tmpConfig.regList[j].addr, numOfRegs);
      tmpConfig.regList[j]['value'] = ModbusFormat.BufferConvert(
        data.data,
        numOfRegs,
        tmpConfig.regList[j].type,
      );
    } catch (err) {
      console.log(err);
    }
  }
  return tmpConfig;
}

async function readRTU(tmpConfig, client) {
  switch (tmpConfig.catlog) {
    case 'inverter':
      Data.cat[0].devList.push(await ReadData(client, tmpConfig, true));
      break;
    case 'battery':
      Data.cat[1].devList.push(await ReadData(client, tmpConfig, true));
      break;
    case 'sensor':
      Data.cat[2].devList.push(await ReadData(client, tmpConfig, true));
      break;
    case 'meter':
      Data.cat[3].devList.push(await ReadData(client, tmpConfig, true));
      break;
  }
}
async function readTCP(tmpConfig, client) {
  switch (tmpConfig.catlog) {
    case 'inverter':
      Data.cat[0].devList.push(await ReadData(client, tmpConfig, false));
      break;
    case 'battery':
      Data.cat[1].devList.push(await ReadData(client, tmpConfig, false));
      break;
    case 'sensor':
      Data.cat[2].devList.push(await ReadData(client, tmpConfig, false));
      break;
    case 'meter':
      Data.cat[3].devList.push(await ReadData(client, tmpConfig, false));
      break;
  }
}
