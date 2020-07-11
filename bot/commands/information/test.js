import { Command } from 'discord.js-commando';

export default class TestCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'test',
      aliases: [],
      group: 'information',
      ownerOnly: true,
      memberName: 'test',
      description: '',
      args: [
        {
          key: 'agu',
          type: 'string',
          prompt: 'what you want to test?',
          parse: () => 'hello this is me'
        }
      ]
    } );
  }

  run ( message, { agu } ) {
    message.say( agu );
  }
}