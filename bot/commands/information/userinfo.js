import { Command } from 'discord.js-commando';
import { emojies, code, infoTime } from '../../Utilities';
import { MessageEmbed } from 'discord.js';

export default class UserinfoCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'user-info',
      aliases: ['ui', 'uinfo'],
      group: 'information',
      memberName: 'userinfo',
      description: 'Gives information of the provided member.',
      args: [
        {
          key: 'member',
          type: 'member',
          prompt: 'What member information you want?'
        }
      ]
    } );
  }

  run ( message, { member } ) {
    const embed = new MessageEmbed()
      .setTitle( `${ emojies.user }  USER INFORMATION  ${ emojies.user }` )
      .setThumbnail( member.user.displayAvatarURL( { size: 64, dynamic: true } ) )
      .addField( 'Username', code( member.user.tag ), true )
      .addField( 'User ID', code( member.id ), true )
      .addField( 'Assigned Roles', code( member.roles.cache.reduce( ( str, role ) => str += `${ role.name }\n`, '' ) ) )
      .addField( 'Nickname', code( member.nickname || 'No nickname set' ), true )
      .addField( 'Status', code( member.user.presence.status ), true )
      // .addField( 'Role Color', code( member.hexColor ), true )
      .addField( 'User Permissions', code( member.permissions.toArray().join( '\n' ) ) )
      .addField( 'Joined Server On', infoTime( member.joinedAt ) )
      .addField( 'Account Created On', infoTime( member.user.createdAt ) )
      .setColor( member.displayHexColor );

    message.say( embed );
  }
}