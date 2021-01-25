const express = require('express');
const app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
const { resolveSoa } = require('dns');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(3000);

//API.routes
var indexRouter = require('./API/routes');
app.use(indexRouter);

//RunModbus之後，啟動FileChange開始偵測Config資料夾內的json，依序抓取資料
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

//FileChange判斷特定資料夾路徑內的三種狀態(新增/修改/移除)，並針對其進行後續動作
function FileChange(FolderPath) {
  var watcher = chokidar.watch(FolderPath, { ignored: /^\./, persistent: true });

  watcher

    .on('add', function (path) {
      try {
        //交由asyncRead去依序抓取config.json的內容，在傳給ReadModbusData去抓資料
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
//ReadModbusData會先判斷這個config屬於RTUorTCP
//再來建立連線，因為RTU無法同時多個連線，若需要非同步執行去抓取點位資料，則須建立client
//在透過Client非同步的設定SlaveID，抓取資料
async function ReadModbusData(config) {
  if (config.potocol == 'modbusRTU') {
    RTUPortDetect(config);
    //建立client提供ReadRTU / ReadTCP去使用readholding register
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
//ReadData會判斷如果是RTU則需額外設定SlaveId，並在交由readHoldingRegister把資料撈出來
//最後在由ModbusFormat.BufferConvert去轉成所想要的資料格式
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
//readRTU / TCP 用於分類接下來要讀出來的資料所要push的catlog類別
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
