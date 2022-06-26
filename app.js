import 'dotenv/config';
import SocketServerws from 'ws';
import express from 'express';
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
  gogowebsocket();
});

 async function gogowebsocket(){
  const url = 'https://discordapp.com/api/gateway/';
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data));
  const wss=new SocketServerws(data.url);
  //開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
  wss.onopen = () => {
    console.log('open connection')
  }
  
  //關閉後執行的動作，指定一個 function 會在連結中斷後執行
  wss.onclose = () => {
    console.log('close connection')
  }
}
