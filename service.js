const WebSocket=require("ws");
const serverURL="ws://automation-experiment.glitch.me/";
let ws = new WebSocket(serverURL);
const { spawn } = require('child_process');
const chalk=require("chalk");

var timerID = 0; 
let timeoutInterval=5000;
var reconnectTimerId=0;
let reconnectDelay=5000;

function onOpen(){
    console.log(chalk.green("Connection open now!,waiting for message from server"));
    keepAlive();
    //attach close and message listeners once connected.
    ws.on("close",onClose);
    ws.on('message', onMessage);
}

function onError(){
    console.log(chalk.red("Error occured! . Trying to reconnect..."));
    setTimeout(function(){
        reconnect();
    },reconnectDelay)
}
function onClose(){
    console.log(chalk.blue("Websocket Closed."));
    //set timeout to reconnect
    setTimeout(function(){
        reconnect();
    },reconnectDelay)

}
function onMessage(message) {
   // console.log(chalk.yellow("received message"),message)
    message=JSON.parse(message);
    if(message.type==="pong"){
        
        console.log(chalk.green('\u2764'));
    }
    if(message.type==="command"){
       // console.log("received heartbeat");
        if(message.data==="sleep"){
            //command for sleep on mac
            spawn('pmset', ['sleepnow']);
        }
        if(message.data==="lock"){
            //command for locking the mac screen.
            spawn('/System/Library/CoreServices/Menu\ Extras/User\.menu/Contents/Resources/CGSession', ["-suspend"])
        }
    }
}
ws.on('open', onOpen);
ws.on('error',onError);




function keepAlive() { 
    if (ws.readyState == ws.OPEN) {  
        ws.send(JSON.stringify({type:'ping',data:null})); 
        process.stdout.write(chalk.yellow('\u2764','==>'))
        //reconnectTimerId=setTimeout(reconnect,reconnectTimer); 
    }  
    timerId = setTimeout(keepAlive, timeoutInterval);  
}  

function reconnect(){
   // console.log("heartbeat not received.tryinn to reconnect...")
    cancelKeepAlive();
    ws=null;
    ws=new WebSocket(serverURL);
    ws.on("open",onOpen);
    ws.on("error",onError);

}

function cancelKeepAlive() {  
    if (timerId) {  
        clearTimeout(timerId);  
    }  
}