
var ModbusRTU = require ("modbus-serial");
CreateClient("/dev/ttyS0",9600,27);

async function CreateClient(hwPort,baudRate,addr){
	let client = await ConnectRTU2(hwPort,baudRate)
	client.setID(addr)
    client.readHoldingRegisters(60218,5).then(console.log)

}
function ConnectRTU2(hwPort,baudRate){   
    return new Promise((resolve,reject)=>{
        let client = new ModbusRTU();
        // open connection to a serial port
        client.connectRTUBuffered(hwPort,{ baudRate: baudRate }).then(result=>{
            resolve(client) ;
        }).catch(err=>{
            reject('connection failed')
        })
        
    });
    
}
