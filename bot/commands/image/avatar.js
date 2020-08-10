import { MessageEmbed } from 'discord.js';
import { Command } from 'discord.js-commando';

export default class MeowCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'avatar',
      aliases: ['dp', 'pfp'],
      description: 'Shows the current discord avatar unless not mentioned someone!',
      group: 'image',
      memberName: 'avatar',
      args: [
        {
          default: false,
          key: 'user',
          type: 'user',
          prompt: 'Whom you want to see the avatar of?'
        }
      ]
    } );
  }

  run ( message, { user } ) {
    const pfpOf = user || message.author;
    const imageEmbed = new MessageEmbed()
      .setAuthor( `Requested By: ${ message.author.username }` )
      .setImage( pfpOf.displayAvatarURL( { format: 'png', dynamic: true, size: 512 } ) );
    return message.embed( imageEmbed );
  }
}
