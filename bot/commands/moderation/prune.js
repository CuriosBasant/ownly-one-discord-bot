import { Command } from 'discord.js-commando';

export default class PruneCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'prune',
      aliases: ['delete', 'remove'],
      group: 'moderation',
      memberName: 'prune',
      description: 'Prunes (Deletes) latest messages of specified count from the current channel',
      args: [
        {
          key: 'count',
          type: 'integer',
          default: 2,
          min: 1,
          max: 99,
          prompt: 'How many messages to delete?',
          error: 'Please provide a valid number between 1 and 100',
          // parse: value => ,
        }
      ],
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_MESSAGES'],
    } );
  }

  run ( message, { count } ) {
    message.channel.bulkDelete( count + 1, true )
      // .then( deletedMessages => message.say( `Successfully deleted` ) )
      .catch( console.error );
  }
}