import { Command } from 'discord.js-commando';
import { emojies } from '../../Utilities';

export default class DisconnectCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'disconnect',
      aliases: ['dc', 'leave'],
      group: 'music',
      memberName: 'disconnect',
      description: 'Disconnects the bot from Voice Channel',
    } );
  }

  run ( message ) {
    let emoji;
    if ( message.guild.voice && message.guild.voice.channel ) {
      message.guild.voice.channel.leave();
      emoji = emojies.thumbup;
    } else {
      emoji = emojies.thumbdown;
    }
    message.react( emoji );

  }
}