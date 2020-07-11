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
    } );
  }

  run ( message ) {
    const user = message.mentions.users.first() || message.author;
    const imageEmbed = new MessageEmbed()
      .setAuthor( `Requested By: ${ message.author.username }` )
      .setImage( user.displayAvatarURL( { format: 'png', dynamic: true } ) );
    return message.embed( imageEmbed );
  }
}
