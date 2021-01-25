const {NodeSSH} = require('node-ssh')
const ssh = new NodeSSH()

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
      ssh.connect({
        host: '172.17.0.1',
        //host: 'localhost',
        username: 'gwsapltpv500',
        password: 'ecs@1oT',
      })
      .then(()=>{
        ssh.execCommand(`echo ${data} > /etc/netplan/00-installer-config.yaml`).then(function(result) {
            console.log('1st STDOUT: ' + result.stdout)
            console.log('1st STDERR: ' + result.stderr)
          }).then(()=>{
            console.log('Network will restart in 10sec');
            ssh.execCommand("echo 'ecs@1oT' | sudo -S netplan apply").then(function(result) {
                console.log('2nd STDOUT: ' + result.stdout)
                console.log('2nd STDERR: ' + result.stderr)
            }).then(()=>{
              PING(status).then(() => {
                res.send(status);
                res.end();
              });
              
            })
          })
      })
    function PING(status) {
      return new Promise((resolve, reject) => {
        ssh.execCommand('ping -c 1 8.8.8.8').then(function(result) {
          if (result.stdout.indexOf('1 received', 0) == -1) {
            status.status = 'Failed';
            reject(status);
          } else {
            status.status = 'Succeed';
            resolve(status);
          }
        })
      });
    }
  },
};