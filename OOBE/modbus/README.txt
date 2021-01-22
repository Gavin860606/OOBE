09/28 待整理
Modbus.js 為main執行程式
---------------------
以下為import程式:
ReadConfig //讀取config並寫入物件
ModbusFormat //讀取modbus資料並轉換成對應的type(s/u16 * s/u32 * float /binary)
ModbusConnect //建立tcp or rtu連線並回傳client
