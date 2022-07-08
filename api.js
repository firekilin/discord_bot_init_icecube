import { DiscordRequest } from './utils.js';

export function sendmessage(channelId,message){
  const endpoint = `/channels/${channelId}/messages`;
        
  const body={
    "content": message,
    "tts": false
  };
  DiscordRequest(endpoint, { method: 'POST', body: body });
}