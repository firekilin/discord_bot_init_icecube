import SocketServerws from 'ws';
import fetch from 'node-fetch';
import { sendmessage } from './api';

export async function gogowebsocket(token){
  let interval=4500;
  const gateway = await (await fetch("https://discord.com/api/gateway")).json();
  const wss = new SocketServerws(gateway.url);
  let payload =
    {
      "op": 2,
      "d": {
        "token": token,
        intents: 16383,
        "properties": {
          "os": "linux",
          "browser": "disco",
          "device": "disco"
        }
      }
    }
  
  wss.on('open',function open(){
    wss.send(JSON.stringify(payload));

  });
  wss.on('message',function incoming(data){

    let payload=JSON.parse(data);

    const {t,s,op,d} = payload;
    console.log("\n\n payload: ");
    console.log(payload);

    switch(op){
      case 10:
        const {heartbeat_interval}=d;
        interval=hearbeat(heartbeat_interval);
        break;


    }

    //get message and send message
    switch(t){
      case 'MESSAGE_CREATE':
        let author=d.author.username;
        let content = d.content;
        if(author.id!=process.env.APP_ID && content=="HI"){
          sendmessage(d.channel_id,"Hi "+author);
        }
    }

  });
  const hearbeat=(ms)=>{
    return setInterval(()=>{
      wss.send(JSON.stringify({op:1,d:null}));
    },ms)
  }


}
 