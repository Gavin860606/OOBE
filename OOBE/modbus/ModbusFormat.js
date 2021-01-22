// create an empty modbus client
// open connection to a tcp line
//buffer=資料,position=點位,regisers=暫存器數量,DataFormat=輸出的資料格式,IsBE=true/false Endian;
//DataFormat格式:u16/u32/s16/s32/float/binary
module.exports = {
  BufferConvert(buffer, registers, DataFormat) {
    var buf = new ArrayBuffer(4);
    buf = buffer;
    if (registers == 1) {
      if (DataFormat == 'u16') {
        return u16(buf);
      } else if (DataFormat == 's16') {
        return s16(buf);
      } else if (DataFormat == 'binary') {
        return binary(buf);
      }
    }
    if (registers == 2) {
      if (DataFormat == 'u32') {
        return u32(buf[0], buf[1]);
        /*if(boolean==true){
                    return u32(buf[position],buf[position+1]);
                }
                else return u32(swap(buf[position+1]),swap(buf[position]));*/
      } else if (DataFormat == 's32') {
        return s32(buf[0], buf[1]);
        /*
                if(boolean==true){
                    return s32(buf[position],buf[position+1]);
                }
                else return s32(swap(buf[position+1]),swap(buf[position]));*/
      } else if (DataFormat == 'float') {
        return float(buf[0], buf[1]);
        /*
                if(boolean==true){
                    return float(buf[position],buf[position+1]);
                }
                else return float(swap(buf[position+1]),swap(buf[position]));*/
      }
    } else {
      return 'No selected data to output';
    }
  },
  ConfigCompiler(buffer, addr, type, boolean) {
    BufferConvert(buffer, addr, type, boolean);
  },
  ConnectTCP(ip, port, uid) {
    var ModbusRTU = require('modbus-serial');
    var client = new ModbusRTU();
    // open connection to a tcp line
    client.connectTCP(ip, { port: port });
    client.setID(uid);
    console.log('Connection successed to ', ip);
  },
};

//少unit參數
//少unit參數
//少unit參數
//輸出給filechange的function,在file change裡面直接呼叫讀取modbus點位
function ConfigCompiler(buffer, addr, type, boolean) {
  BufferConvert(buffer, addr, type, boolean);
}

function ConnectTCP(ip, port, uid) {
  var ModbusRTU = require('modbus-serial');
  var client = new ModbusRTU();
  // open connection to a tcp line
  client.connectTCP('192.168.8.138', { port: 502 });
  client.setID(1);
}

function BufferConvert(buffer, position, DataFormat, boolean) {
  var buf = new ArrayBuffer(4);
  buf = buffer;
  if (DataFormat == u16 || DataFormat == s16) {
    if (DataFormat == u16) {
      return u16(buf[position]);
    } else if (DataFormat == s16) {
      return s16(buf[position]);
    }
  }
  if (DataFormat == u32 || DataFormat == s32 || DataFormat == float) {
    if (DataFormat == u32) {
      if (boolean == true) {
        return u32(buf[position], buf[position + 1]);
      } else return u32(swap(buf[position + 1]), swap(buf[position]));
    } else if (DataFormat == s32) {
      if (boolean == true) {
        return s32(buf[position], buf[position + 1]);
      } else return s32(swap(buf[position + 1]), swap(buf[position]));
    } else if (DataFormat == float) {
      if (boolean == true) {
        return float(buf[position], buf[position + 1]);
      } else return float(swap(buf[position + 1]), swap(buf[position]));
    }
  } else {
    return 'No selected data to output';
  }
}

function u16(data) {
  /*var buf = new ArrayBuffer(4);
    var ints = new Uint16Array(buf);
    ints=data;*/
  return data[0];
}

function s16(data) {
  if (data < 256) return data;
  else return s16TwoComlement(data[0]);
}
function binary(data) {
  data = parseInt(data, 10);
  data = data.toString(2);
  let binary = '0000000000000000';
  binary += data;
  binary = binary.substr(binary.length - 16, 16);
  return binary;
}
function s16TwoComlement(data) {
  let binary = data.toString(2);
  let binarr = [];

  for (let i = 0; i < binary.length; i++) {
    if (binary[i] == '0') {
      binarr.push('1');
    } else if (binary[i] == '1') {
      binarr.push('0');
    }
  }
  for (let i = binarr.length - 1; i >= 0; i--) {
    if (binarr[i] == '0') {
      binarr[i] = '1';
      break;
    } else if (binarr[i] == '1') {
      binarr[i] = '0';
      if (binarr[i - 1] == '0') binarr[i - 1] = '1';
      else {
        let p = 0;
        for (let j = i; binarr[j] != '0'; j--) {
          binarr[j] = '0';
          p = j;
        }
        binarr[p - 1] = '1';
      }
      break;
    }
  }
  let val = parseInt(binarr.join(''), 2) * -1;
  return val;
}

function s32(data1, data2, boolean) {
  var buf = new ArrayBuffer(4);
  var ints = new Int16Array(buf);
  // Fill in the values
  ints[0] = data2;
  ints[1] = data1;
  // Create a 32-bit float view of it
  var s32 = new Int32Array(buf);
  var num = s32[0];
  // Done
  if (num > 0) return num;
  else return TwoComlement(num);
}
function u32(data1, data2) {
  var buf = new ArrayBuffer(4);
  var ints = new Uint16Array(buf);
  // Fill in the values
  ints[0] = data2;
  ints[1] = data1;
  // Create a 32-bit float view of it
  var u32 = new Uint32Array(buf);
  var num = u32[0];
  // Done
  return num;
}

function swap(val) {
  return ((val & 0xff) << 8) | ((val >> 8) & 0xff);
}
function TwoComlement(data) {
  data = ~data + 1;
  return data;
}

function float(data1, data2) {
  var buf = new ArrayBuffer(4);
  // Create a 16-bit int view of it
  var ints = new Uint16Array(buf);
  // Fill in the values
  ints[0] = data2;
  ints[1] = data1;
  // Create a 32-bit float view of it
  var floats = new Float32Array(buf);
  // Read the bits as a float; note that by doing this, we're implicitly
  // converting it from a 32-bit float into JavaScript's native 64-bit double
  var num = floats[0];
  num = num.toFixed(2); //小數點後四位
  // Done
  return parseFloat(num);
}
