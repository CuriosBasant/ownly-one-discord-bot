import { Command } from 'discord.js-commando';


export default class MeowCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'meow',
      group: 'fun',
      memberName: 'meow',
      description: 'Replies with a meow, kitty cat.',
    } );
  }

  run ( message ) {
    return message.say( 'Meow!' );
  }
}