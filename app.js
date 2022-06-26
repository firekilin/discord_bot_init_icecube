import 'dotenv/config';
import {Server} from 'ws';
import express from 'express';
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


const servers=app.listen(9527, () => {
  console.log('Listening on port 9527');
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND
  ]);
});

const wss=new Server({servers})

wss.on('connection',ws=>{
  console.log('Client connected')
  // 當收到client消息時
  ws.on('message', data => {
    // 收回來是 Buffer 格式、需轉成字串
    data = data.toString()  
    console.log(data) // 可在 terminal 看收到的訊息

    /// 發送消息給client 
    ws.send(data)

    /// 發送給所有client： 
    let clients = wss.clients  //取得所有連接中的 client
    clients.forEach(client => {
        client.send(data)  // 發送至每個 client
    })
  })
  // 當連線關閉
  ws.on('close', () => {
    console.log('Close connected')
  })
});