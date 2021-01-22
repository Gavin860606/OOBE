// create an empty modbus client

// read the values of 10 registers starting at address 0
// on device number 1. and log the values to the console.位,regisers=暫存器數量,DataFormat=輸出的資料格式,IsBE=true/false Endian;
//DataFormat格式:u16/u32/s16/s32/float/binary
module.exports ={
    //需要使用promise才能確保連線建立玩之後，才交給後續程式進行資料抓取
    //回傳連線完成的client

    ConnectTCP(ip,port,uid){
        return new Promise((resolve,reject)=>{
            var ModbusTCP = require("modbus-serial");
            let client = new ModbusTCP();
            // open connection to a serial port
            client.setID(uid);
            client.connectTCP(ip, { port: port }).then(result=>{
                console.log("Connect TCP succeed:","ip:",ip,"port",port)
                resolve(client) ;
            }).catch(err=>{
                reject('TCP connection failed')
            })
            
        });

    },
    ConnectRTU(hwPort,baudRate,communicationFormat){   
        return new Promise((resolve,reject)=>{
            var ModbusRTU = require("modbus-serial");
            let client = new ModbusRTU();
            // open connection to a serial port
            //client.setID(addr);
            try{
                client.connectRTUBuffered(hwPort,{ baudRate: baudRate }).then(result=>{
                    console.log("Connect RTU succeed:","portocol:",hwPort,"baudRate:",baudRate,"address:")
                    resolve(client) ;
                }).catch(err=>{
                    reject('RTU connection failed')
                })
            }
            catch(err){
                console.log('RTU connection failed')
            }
                
            
        });
    }
}


function ConnectTCP(ip,port,uid){       
        client = new ModbusP();
        client.connectTCP(ip, { port: port });
        client.setID(uid);
        return client;

}
function ConnectTCP (path)  {
    var fs = require('fs');
    return new Promise((resolve,reject)=>{   
        fs.readFile(path, function (err, data) {
            data =JSON.parse(data)
            if(isJASON(data)==true){
                resolve(data);
            }
            else{
                reject(new Error(path));
            }
        });      
    });
    
}

function ConnectRTU(hwPort,baudRate,addr,communicationFormat){   
    console.log("Connect RTU succeed:",hwPort,baudRate,addr)

        var ModbusRTU = require ("modbus-serial");
        var client = new ModbusRTU();
        // open connection to a serial port
        client.connectRTUBuffered(hwPort,{ baudRate: baudRate });
        client.setID(addr);
        return client;
}
/*
 
//create ModbusMaster instance and pass the serial port object
const master = new ModbusMaster(serialPort);
 
//Read from slave with address 1 four holding registers starting from 0.
master.readHoldingRegisters(1, 0, 4).then((data) => {
    //promise will be fulfilled with parsed data
    console.log(data); //output will be [10, 100, 110, 50] (numbers just for example)
}, (err) => {
    //or will be rejected with error
});
 
//Write to first slave into second register value 150.
//slave, register, value
master.writeSingleRegister(1, 2, 150).then(success, error);
*/