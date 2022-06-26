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
  console.log("body:");
  console.log(req.body);
  gogowebsocket(process.env.DISCORD_TOKEN);
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
  
});
let gogowebsocket=(token)=>{
  let interval=0;
  const wss=new SocketServerws('wss://gateway.discord.gg/?v=10&encoding=json');
  let payload =
    {
      "op": 2,
      "d": {
        "token": token,
        "properties": {
          "os": "linux",
          "browser": "disco",
          "device": "disco"
        },
        "compress": true,
        "large_threshold": 250,
        "shard": [0, 1],
        "presence": {
          "activities": [{
            "name": "hello kilin",
            "type": 0
          }],
          "status": "dnd",
          "since": 91879201,
          "afk": false
        },
        // This intent represents 1 << 0 for GUILDS, 1 << 1 for GUILD_MEMBERS, and 1 << 2 for GUILD_BANS
        // This connection will only receive the events defined in those three intents
        "intents": 8
      }
    }
  }
  wss.on('open',function open(){
    console.log("open:");
    console.log(payload);
    wss.send(JSON.stringify(payload));

  });
  wss.on('message',function incoming(data){
    
    let payload=JSON.parse(data);
    console.log("message:");
    console.log(payload);
    const {t,event,op,d} = payload;
    switch(op){
      case 10:
        const {heartbeat_interval}=d;
        wss.send(JSON.stringify(payload));
        interval=hearbeat(heartbeat_interval);
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



}
 