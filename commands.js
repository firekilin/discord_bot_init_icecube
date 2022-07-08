import { createcommand } from './api.js';

export async function commandinit(){
  createcommand(TEST_COMMAND);
}
  

// Simple test command
export const TEST_COMMAND = {
  name: 'hello',
  description: 'Basic guild command',
  type: 1,
};