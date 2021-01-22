const express = require('express');
const app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
const { resolveSoa } = require('dns');
const path = require('path');
var exe = require('ssh-exec');
const { exec } = require('child_process');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

module.exports = {
  SetInternet(req, res) {
    let status = {
      status: null,
    };
    let data = `network:'\n''  'ethernets:'\n''    'enp1s0:'\n''      'addresses: [${req.body.ip}]'\n''      'gateway4: ${req.body.gw}'\n''      'nameservers:'\n''        'addresses: [${req.body.dns}]'\n''      'dhcp4: no'\n''    'enp2s0:'\n''      'dhcp4: true'\n''  'version: 2`;
    //`network:\n  ethernets:\n    enp1s0:\n      addresses: [${req.body.ip}]\n      gateway4: ${req.body.gw}\n      nameservers:\n      addresses: [${req.body.dns}]\n      dhcp4: no\n    enp2s0:\n      dhcp4: true\n  version: 2`
    // or using the more settings
    // exec("echo "+data+"> /etc/netplan/w.txt", {
    //exec( fs.writeFileSync('/etc/netplan/789.txt',data), {
    exe(`echo ${data} > /etc/netplan/00-installer-config.yaml`, {
      host: '172.17.0.1',
      //host: 'localhost',
      user: 'gwsapltpv500',
      password: 'ecs@1oT',
    }).pipe(process.stdout);
    console.log('Network will restart in 10sec');
    setTimeout(() => {
      exe("echo 'ecs@1oT' | sudo -S netplan apply", {
        host: '172.17.0.1',
        //host: 'localhost',
        user: 'gwsapltpv500',
        password: 'ecs@1oT',
      }).pipe(process.stdout);
      setTimeout(() => {
        PING(status).then(() => {
          res.send(status);
          res.end();
        });
      }, 3000);
    }, 3000);
    function PING(status) {
      /* return new Promise((resolve, reject) => {
        exec('ping -c 1 8.8.8.8', (error, stdout, stderr) => {
          if (error) {e
            console.error(`error: ${error}`);
            reject();
            return;
          }
          console.log(stdout.indexOf('1 received', 0));
          if (stdout.indexOf('1 received', 0) == -1) status.status = 'Failed';
          else status.status = 'Succeed';
          resolve(status);
        });
      });*/
      return new Promise((resolve, reject) => {
        exec(
          'ping -c 1 8.8.8.8',
          {
            host: '172.17.0.1',
            //host: 'localhost',
            user: 'gwsapltpv500',
            password: 'ecs@1oT',
          },
          function (err, stdout, stderr) {
            console.log(stdout.indexOf('1 received', 0));
            if (stdout.indexOf('1 received', 0) == -1) {
              status.status = 'Failed';
              reject(status);
            } else {
              status.status = 'Succeed';
              resolve(status);
            }
          },
        );
      });
    }
  },
};
function SetInternet(req, res) {
  let data = `network:'\n''  'ethernets:'\n''    'enp1s0:'\n''      'addresses: [${req.body.ip}]'\n''      'gateway4: ${req.body.gw}'\n''      'nameservers:'\n''        'addresses: [${req.body.dns}]'\n''      'dhcp4: no'\n''    'enp2s0:'\n''      'dhcp4: true'\n''  'version: 2`;
  //`network:\n  ethernets:\n    enp1s0:\n      addresses: [${req.body.ip}]\n      gateway4: ${req.body.gw}\n      nameservers:\n      addresses: [${req.body.dns}]\n      dhcp4: no\n    enp2s0:\n      dhcp4: true\n  version: 2`
  // or using the more settings
  // exec("echo "+data+"> /etc/netplan/w.txt", {
  //exec( fs.writeFileSync('/etc/netplan/789.txt',data), {
  exe(`echo ${data} > /etc/netplan/00-installer-config.yaml`, {
    host: '172.17.0.1',
    //host: 'localhost',
    user: 'gwsapltpv500',
    password: 'ecs@1oT',
  }).pipe(process.stdout);
  console.log('Network will restart in 10sec');
  setTimeout(() => {
    exe("echo 'ecs@1oT' | sudo -S netplan apply", {
      host: '172.17.0.1',
      //host: 'localhost',
      user: 'gwsapltpv500',
      password: 'ecs@1oT',
    }).pipe(process.stdout);
  }, 8000);
  exe('ping 8.8.8.8', {
    host: '172.17.0.1',
    //host: 'localhost',
    user: 'gwsapltpv500',
    password: 'ecs@1oT',
  }).pipe(process.stdout);
} /*
const ls = spawn('ping -c 1 8.8.8.8');
ls.stdout.on('data', (data) => {
  // console.log(data.indexOf('1 received', 0));
  // if (data.indexOf('1 received', 0) == -1) status.status = 'Failed';
  // else status.status = 'Succeed';
  console.log(data);
});*/
/*
let data =
`network:'\n''  'ethernets:'\n''    'enp1s0:'\n''      'addresses: [${7}]'\n''      'gateway4: ${8}'\n''      'nameservers:'\n''        'addresses: [${9}]'\n''      'dhcp4: no'\n''    'enp2s0:'\n''      'dhcp4: true'\n''  'version: 2`
exec(`echo ${data} > /etc/netplan/1233.txt`, {
    //host: '172.17.0.1',
    host: 'localhost',
    user: 'gwsapltpv500',
    password: 'ecs@1oT'
  }).pipe(process.stdout)
*/

/*
  let x = 'xxx'
  let data =`16668${x}7212`
exec(`echo ${data} > /etc/netplan/1233.txt`, {
    //host: '172.17.0.1',
    host: 'localhost',
    user: 'gwsapltpv500',
    password: 'ecs@1oT'
  }).pipe(process.stdout)*/
/*
  # This is the network config written by 'subiquity'
  network:
    ethernets:
            #    enp0s20u5u1:
            #      dhcp4: true
      enp1s0:
        #addresses: [192.168.8.200/24]
        #gateway4: 192.168.8.200
        #nameservers:
          #addresses: [8.8.8.8,8.8.8.4]
        dhcp4: true
      enp2s0:
        dhcp4: true
    version: 2
*/
/*
exec(
  'ping -c 1 8.8.8.8',
  {
    //host: '172.17.0.1',
    host: 'localhost',
    user: 'gwsapltpv500',
    password: 'ecs@1oT',
  },
  function (err, stdout, stderr) {
    console.log(stdout.indexOf('1 received', 0));
    if(stdout.indexOf('1 received', 0)==-1)status.status="Failed"
    else status.status="Succeed"
    console.log(stdout);
  },
);*/
function PING() {
  let status = {
    status: null,
  };
  exec('ping -c 1 8.8.8.8', (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error}`);
      return;
    }
    console.log(stdout.indexOf('1 received', 0));
    if (stdout.indexOf('1 received', 0) == -1) status.status = 'Failed';
    else status.status = 'Succeed';
    console.log(status);
  });
}
