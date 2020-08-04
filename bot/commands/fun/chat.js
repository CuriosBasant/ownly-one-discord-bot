import apiai from 'apiai';
import { Command } from 'discord.js-commando';

const app = apiai( "6d6f546051164cbf9103b51f7f0556d6" );

export default class ChatCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'chat',
      aliases: ['say', 'talk'],
      group: 'fun',
      memberName: 'chat',
      description: 'Talk with Ownly One',
      args: [
        {
          key: 'query',
          prompt: 'What you would like me to talk about?',
          type: 'string'
        }
      ]
    } );
  }

  run ( message, { query } ) {
    const request = app.textRequest( query, { sessionId: 'ownlyonebot' } );
    request.on( 'response', response => {
      message.channel.startTyping();

      setTimeout( () => {
        let reply = response.result.fulfillment.speech;
        if ( !reply ) reply = 'Well, I can\'t do that';
        message.say( reply ).catch( console.error );
        message.channel.stopTyping();
      }, Math.random() * 3000 + 1000 );

      console.log( response.result.fulfillment.messages );
    } );

    request.on( 'error', console.error );

    request.end();
  }
}