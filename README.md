Installation
------
First install node and npm on your raspberry Pi. You can follow [this](http://blog.rueedlinger.ch/2013/03/raspberry-pi-and-nodejs-basic-setup/) for instructions. 

After cloning the repo, get the dependencies:
```
npm install
```

You will need `SoX` to play the sounds. Install it on the rPi using apt-get 
```
sudo apt-get install sox
```

Usage
-----

Next you will need to define where your server resides in `config.js`
```javascript
module.exports = {
  url: 'http://192.168.1.85:3000'
}
```

On the rPi, run `node sound.js` to start the websocket client
