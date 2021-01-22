var Modbus = require("modbus-serial")
var ConfigReader = require("./ReadConfig")
var ModbusConnect = require("./ModbusConnect")
//var convert = require("./ModbusFormat")
var chokidar = require('chokidar');
var i=0;
var Data ={
    cat:[
        {
            catlog:"inverter",
            devList:[{}]
        },
        {
            catlog:"battery",
            devList:[{}]
        },
        {
            catlog:"sensor",
            devList:[{}]
        },
        {
            catlog:"meter",
            devList:[{}]
        },
        {
            catlog:"loger",
            devList:[{}]
        }

    ]
}
FileChange("/home/gwsapltpv500/test/modbusTest/config");
function readDevData(client, funCode, addr, numOfRegs,type){
	console.log("promise: ",client)
	return new Promise((resolve,reject)=>{
			if (funCode ==3){
				setTimeout(function(){
					client.readHoldingRegisters(addr, numOfRegs),function (err,data){
						var retV = data.data
						console.log(retV);
						//retV = convert.BufferConvert(retV,addr,numOfRegs,type)
						resolve(retV);
					}
				},10)
			}
			else if(funCode == 4){
				setTimeout(function(){
				client.readInputRegisters(addr, numOfRegs),function (err,data){
					var retV = data.data
					//retV = convert.BufferConvert(retV,addr,numOfRegs,type)
					resolve(retV);
				}
				},10)
			}
			else reject('Something Wrong in readDevData')		
	});
}


function FileChange(FolderPath){
	var Configlist = new Array();
    var watcher = chokidar.watch(FolderPath, {ignored: /^\./, persistent: true});

    watcher

    .on('add', async function(path) {

	  let config = await asyncRead(path);
	  console.log('File: ',path,'\n',config)
	  connect(config)
	  
    })
    .on('change', function(path) {
        console.log('File', path,'has been changed');
        
    })
    .on('unlink', function(path) {
        console.log('File', path, 'has been removed');
    })
    .on('error', function(error) {console.error('Error happened', error);})
}



//console.log(ConfigReader.ReadFile("/home/gwsapltpv500/test/modbusTest/config/exConfig.json"));
//ConfigReader.ReadPromise("/home/gwsapltpv500/test/modbusTest/config/exConfig.json")


 function asyncRead (path)  {
	return new Promise(async (resolve,reject)=>{  	
		let readconfig = await ConfigReader.ReadPromise(path);
		resolve(readconfig)
	});
}



async function connect(config){ 
	if(config.potocol=="modbusRTU"){

		switch(config.settings.hwPort){
			case "COM1":
				config.settings.hwPort = "/dev/ttyS0"
				break;
			case "COM2":
				config.settings.hwPort = "/dev/ttyS1"
				break;
			case "COM3":
				config.settings.hwPort = "/dev/ttyS2"
				break;
			case "COM4":
				config.settings.hwPort = "/dev/ttyS3";
				break;
		}
		for (let i = 0; i< Object.keys(config.devList).length; i++) {

            let client = ModbusConnect.ConnectRTU(config.settings.hwPort , config.settings.baudRate	, config.devList[i].slaveId);
			 //return client;
			 config.devList[i]["hwPort"]=config.settings.hwPort;		
			 config.devList[i]["baudRate"]=config.settings.baudRate;
			 config.devList[i]["communicationFormat"]=config.settings.communicationFormat;

			 console.log(config.devList[i]);
			switch(config.devList[i].catlog){
				case "inverter":
					for(let j = 0;i<Object.keys(config.devList[i].regList[j]).length;j++){
						switch(config.devList[i].regList[j].type){
							case "u32":
								numOfRegs=2;
								break;
							case "s32":
								numOfRegs=2;
								break;
							case "float":
								numOfRegs=2;
								break;	
							default :
								numOfRegs=1;
								break;
						}
						try {
							let y = await readDevData(client,config.devList[i].regList[j].funCode,config.devList[i].regList[j].addr,numOfRegs,config.devList[i].regList[j].type)
							console.log(y)	
							
						} catch (error) {
							console.log(error)	
							
						}
          
					   //console.log(readDevData(client,config.devList[i].regList[j].funCode,config.devList[i].regList[j].addr,numOfRegs,config.devList[i].regList[j].type))
						
						Data.cat[0].devList.push(config.devList[i]);
						
					}			
					break;
			}   							             
		}	
	}
}

