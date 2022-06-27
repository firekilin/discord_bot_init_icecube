import 'dotenv/config';
import SocketServerws from 'ws';
import express, { json } from 'express';
import fetch from 'node-fetch';
import { InteractionType, InteractionResponseType,verifyKeyMiddleware  } from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji } from './utils.js';
import {
  TEST_COMMAND,
  HasGuildCommands
} from './commands.js';
// Create and configure express app
const app = express();
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
 app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" guild command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }
    
  }

});


app.listen(9527, () => {
  console.log('Listening on port 9527');
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND
  ]);
  gogowebsocket(process.env.DISCORD_TOKEN);
});
let gogowebsocket=async (token)=>{
  let interval=0;
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
    wss.send()
    switch(op){
      case 10:
        const {heartbeat_interval}=d;
        interval=hearbeat(heartbeat_interval);
        break;
      default:
        interval=hearbeats(heartbeat_interval,s);
        break;

    }

    switch(t){
      case 'MESSAGE_CREATE':
        let author=d.author.username;
        let content = d.content;
        console.log(author+":"+content);
    }

  });
  const hearbeat=(ms)=>{
    return setInterval(()=>{
      wss.send(JSON.stringify({op:2,d:null}));
    },ms)
  }
  const hearbeats=(ms,s)=>{
    return setInterval(()=>{
      wss.send(JSON.stringify({op:1,d:s}));
    },ms)
  }


}
 