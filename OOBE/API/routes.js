var express = require('express');
var router = express.Router();
var AddDev = require('./DeviceAPI/AddDev_API');
var DelDev = require('./DeviceAPI/DelDev_API ');
var DelDevPort = require('./DeviceAPI/DelDeVPort_API');
var GetDevPortList = require('./DeviceAPI/GetDevPortList_API');
var GetDevPortSetting = require('./DeviceAPI/GetDevPortSetting_API');
var GetModelConfig = require('./DeviceAPI/GetModelConfig_API');
var setDevPort = require('./DeviceAPI/SetDevPortAPI');
var TestAPI = require('./DeviceAPI/Test_API');
var COMEdit = require('./DeviceAPI/COMEdit_API');
var SetInternet = require('./NetworkAPI/SetStaticInternet');

router.post('/AddDev',AddDev.AddDev)
router.post('/DelDev',DelDev.DelDev)
router.post('/DelDevPort',DelDevPort.DelDevPort)
router.post('/RTU_GWPort',GetDevPortList.GetPortList)
router.post('/GetDevPortSetting',GetDevPortSetting.GetDevPort)
router.post('/GetModelConfig',GetModelConfig.GetModelConfig)
router.post('/COMSettings',setDevPort.SetDevPort)
router.post('/TestTCP',TestAPI.TestTCPAPI)
router.post('/TestRTU',TestAPI.TestRTUAPI)
router.post('/SetInternet',SetInternet.SetInternet)
router.post('/COMEdit',COMEdit.COMEdit)

module.exports = router;
