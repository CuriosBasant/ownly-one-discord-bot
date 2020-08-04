import { Command } from 'discord.js-commando';

export default class StatusCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'status',
      aliases: [],
      group: 'moderation',
      memberName: 'status',
      description: '',
      args: [
        {
          key: 'text',
          type: 'string',
          prompt: 'Enter the status string.'
        }
      ]
    } );
  }

  run ( message, { text } ) {
    this.client.user.setActivity( text );
  }
}