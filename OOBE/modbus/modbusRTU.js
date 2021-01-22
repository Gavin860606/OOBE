var ModbusRTU = require('modbus-serial');
/*
module.exports ={
    ConnectRTU(hwPort,baudRate,addr,communicationFormat){   
        var ModbusRTU = require ("modbus-serial");
        var client = new ModbusRTU();
        // open connection to a serial port
        client.connectRTUBuffered(hwPort,{ baudRate: baudRate });
        client.setID(addr);
    
        setInterval(function() {
            client.readHoldingRegisters(60218, 5, function(err, data) {
                console.log(data.data);
                console.log("HELLO");
            });
        }, 1000);
}
*/

//read(ConnectRTU("/dev/ttyS0",9600,27));

//asyncRead("/dev/ttyS0",9600,27,read)

//ConnectRTU2("/dev/ttyS0",9600,27,read);
//console.log(ConnectRTU("/dev/ttyS0",9600,27))
//ConnectRTU("/dev/ttyS0",9600,27)
/*
function asyncRead (hwPort,baudRate,addr,callback)  {
	return new Promise(async (resolve,reject)=>{  	
		let result = await ConnectRTU2(hwPort,baudRate,addr);
		resolve(callback(result))
	});
}
*/
//read(ConnectRTU("/dev/ttyS0",9600,27));

//asyncRead("/dev/ttyS0",9600,27)

/*
let x = asyncRead("/dev/ttyS0",9600,27)
console.log(x);*/
//test(ConnectRTU("/dev/ttyS0",9600,27));

//console.log(asyncRead("/dev/ttyS0",9600,27))

var x = {};
//console.log(x);

async function asyncRead(hwPort, baudRate, addr, callback) {
  var result;
  let client = ConnectRTU(hwPort, baudRate, addr);
  console.log(client);
  setTimeout(function () {
    client.readHoldingRegisters(60218, 5, function (err, data, x) {
      if (err) console.log(err);
      else {
        console.log(data);
        //return data
        x = data;
        console.log(x);
      }
    });
    // return client.readHoldingRegisters(60218, 5, function(data) { });
  }, 10);
}
// wait()
//console.log("main call:",wait())
async function wait() {
  /*let y = await readPromise("/dev/ttyS0",9600,27)
    console.log(y)*/
  let client = ConnectRTU('/dev/ttyS0', 9600, 27);

  console.log('outside', client);
  // client.setTimeout(100)
  // client.readHoldingRegisters(60218,5).then(data=>{
  //     console.log(data)
  // }).catch(err=>{
  //     console.log(err)
  // });
}

/*
function readPromise(hwPort,baudRate,addr,callback){  
    let client =   ConnectRTU(hwPort,baudRate,addr)
    return new Promise((resolve,reject)=>{
          setTimeout(function(){
        client.readHoldingRegisters(60218,5,function (err,data){
            if(err) console.log(err); 
            else{
                let result = data.data
                console.log("promise",result); 
                resolve(result) ;    
            } 
        })  
         },10)  
    });
}*/

function read(cb) {
  console.log(cb);
  setTimeout(function () {
    cb.readHoldingRegisters(60218, 5, function (err, data) {
      console.log('cbcb', cb);
      if (err) console.log(err);
      else console.log(data.data);
    });
  }, 10);

  // cb.readHoldingRegisters(60218, 5, function(err,data) {
  //     console.log("cbcb",cb)
  //      if(err) console.log(err);
  //      else console.log(data);
  //  });
}

CreateClient('/dev/ttyS1', 9600, 2);

async function CreateClient(hwPort, baudRate, addr) {
  let client = await ConnectRTU2(hwPort, baudRate, addr);
  client.readHoldingRegisters(60218, 5).then(console.log);
}

function ConnectRTU(hwPort, baudRate, addr, callback) {
  var ModbusRTU = require('modbus-serial');
  var client = new ModbusRTU();
  // open connection to a serial port
  client.setID(addr);
  client
    .connectRTUBuffered(hwPort, { baudRate: baudRate })
    .then((result) => {
      client
        .readHoldingRegisters(0, 2)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });

  // console.log("func",client);
}

function ConnectRTU2(hwPort, baudRate, addr, callback) {
  return new Promise((resolve, reject) => {
    let client = new ModbusRTU();
    // open connection to a serial port
    client.setID(addr);
    client
      .connectRTUBuffered(hwPort, { baudRate: baudRate })
      .then((result) => {
        resolve(client);
      })
      .catch((err) => {
        reject('connection failed');
      });
  });
}
