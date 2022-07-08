import { DiscordRequest } from './utils.js';
import 'dotenv/config';

export  async  function sendmessage(channelId,message){
  const endpoint = `/channels/${channelId}/messages`;
        
  const body={
    "content": message,
    "tts": false
  };
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: body });
  } catch (err) {
    console.error(err);
  }

}

export async function createcommand(commands){
  const endpoint = `/applications/${process.env.APP_ID}/commands`;
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: body });
  } catch (err) {
    console.error(err);
  }
 
}

