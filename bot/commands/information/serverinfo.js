import { Command } from 'discord.js-commando';
import { emojies, code, infoTime } from '../../Utilities';
import { MessageEmbed } from 'discord.js';
import Moment from 'moment';

export default class ServerinfoCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'server-info',
      aliases: ['si', 'sinfo'],
      group: 'information',
      memberName: 'serverinfo',
      description: 'Gives information of the server.'
    } );
  }

  run ( message ) {
    const server = message.guild;
    const emoji = server.emojis.cache.partition( emoji => emoji.animated );
    const member = server.members.cache.partition( member => member.user.bot );
    const embed = new MessageEmbed()
      .setTitle( `${ emojies.server }  SERVER INFORMATION  ${ emojies.server }` )
      .setThumbnail( server.iconURL( { size: 64, dynamic: true } ) )
      .addField( 'Server Name', code( server.name ), true )
      .addField( 'Server Owner', code( server.owner.user.tag ), true )
      .addField( 'Server Description', code( server.description || 'No description set' ) )
      .addField( `Total Server Members [${ server.memberCount }]`, code( `Members: ${ member[1].size } | Bots: ${ member[0].size }` ) )
      .addField( 'Server ID', code( server.id ), true )
      .addField( 'Server Region', code( server.region ), true )
      .addField( `Server Channels [${ server.channels.cache.size }]`, code( `Category: ${ 0 } | Voice: ${ 0 } | Text: ${ 0 }` ) )
      .addField( `Server Emojis [${ server.emojis.cache.size }]`, code( `Normal: ${ emoji[1].size } | Animated: ${ emoji[0].size }` ) )
      .addField( 'Server Boost Level', code( server.mfaLevel ), true )
      .addField( 'Server Boost Amount', code( server.premiumSubscriptionCount ), true )
      .addField( 'Server Roles', code( server.roles.cache.reduce( ( arr, role ) => arr.concat( role.name ), [] ).join( ', ' ) ) )
      .addField( 'Server Created On', infoTime( server.createdAt ) )
      ;

    message.say( embed );
  }
}