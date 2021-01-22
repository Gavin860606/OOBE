var ConfigReader = require('./ReadConfig');
var ModbusConnect = require('./ModbusConnect');
var ModbusFormat = require('./ModbusFormat');
const fs = require('fs');
const path = require('path');
//var convert = require("./ModbusFormat")
var chokidar = require('chokidar');
const express = require('express');
const app = express();
var http = require('http');
// function Socket(data) {
//   var server = http.createServer(function (request, response) {
//     console.log('Connection');
//     response.writeHead(200, { 'Content-Type': 'text/html' });
//     response.write(JSON.stringify(data));
//     response.end();
//   });
//   server.listen(8001);
// }

var Data = {
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

FileChange('/home/gwsapltpv500/docker-test/OOBE/OOBE/config');
var FileLen;
var count = 0;
fs.readdir('/home/gwsapltpv500/docker-test/OOBE/OOBE/config', (err, files) => {
  FileLen = files.length;
});
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
      await readRTU(tmpConfig, client);
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
        readTCP(tmpConfig, client);
      });
    }
  }
  //console.log(Data);
  count++;
  if (count == FileLen) {
    console.log('FINAL DATA:', Data);
    //Socket(JSON.stringify(DataSocket));
    // Socket(Data);
  }
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
    case 'binary':
      numOfRegs = 1;
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
      //console.log(ModbusFormat.BufferConvert(data.data,numOfRegs,tmpConfig.regList[j].type))
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
