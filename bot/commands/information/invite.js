const { MessageEmbed } = require( 'discord.js' );

import { Command } from 'discord.js-commando';

export default class InviteCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'invite',
      aliases: ['joinme'],
      group: 'information',
      memberName: 'invite',
      description: 'Creates a invite link.',
    } );
  }

  async run ( message ) {
    const inviteURL = await message.client.generateInvite();
    message.replyEmbed(
      new MessageEmbed()
        .setColor( '#00AfFF' )
        .setDescription( `[Wanna invite me, to your server!](${ inviteURL })` )
        .setFooter(
          message.client.user.username,
          message.client.user.displayAvatarURL( { format: 'jpg', dynamic: true } )
        )
    );
  }
}
