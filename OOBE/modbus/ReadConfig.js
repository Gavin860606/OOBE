const { rejects } = require('assert');

/*
ReadFile("/home/gwsapltpv500/test/modbusTest/config/exConfig.json");
console.log(
    ReadFile("/home/gwsapltpv500/test/modbusTest/config/exConfig.json",function(err,data){

    })
);*/
module.exports ={

    isJASON(data){
        if(typeof data =="object"){
            return true;
        }
        else return false;
        
    },
    ReadPromise (path)  {
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
    
}



function ReadFile(path){
    var fs = require('fs');
    fs.readFile(path, function (err, data) {
        if (err) throw err;  
        try{
            data =JSON.parse(data);      
            if(isJASON(data)==true){
                console.log("FILE: ",path," is a JASON FILE")
                console.log(data);
                return data;
            }
            else console.log("FILE: ",path," is not  a JASON FILE");       
        }
        catch(e){
            console.log("File: ",path,"isn't recognizable");
        } 
        /*
        for (let i = 0; i< data.regList.length; i++) {
            var data2 = JSON.stringify(data.regList[i]);
           // console.log(data.regList[i].addr);
            console.log(data2,"\n");            
        } */

    });
}

function isJASON(data){
    if(typeof data =="object"){
        return true;
    }
    else return false;
    
}
/*
ReadPromise("/home/gwsapltpv500/test/modbusTest/config/exConfig.json").then((data)=>{
    console.log(data);
}).catch((err)=>{
    console.log("FILE: ",err," is not  a JASON FILE")
})
*/
function ReadPromise (path)  {
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
