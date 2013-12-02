Usage
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
On the rPi, run `node sound.js` to start the websocket client
