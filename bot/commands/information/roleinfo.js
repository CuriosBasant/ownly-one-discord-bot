import { Command } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';
import { emojies, code, infoTime } from '../../Utilities';

export default class RoleinfoCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'role-info',
      aliases: ['ri', 'rinfo'],
      group: 'information',
      memberName: 'roleinfo',
      description: 'Gives information of the provided role.',
      args: [
        {
          key: 'role',
          type: 'role',
          prompt: 'What role information you want?'
        }
      ]
    } );
  }

  run ( message, { role } ) {
    const embed = new MessageEmbed()
      .setTitle( `${ emojies.user }  ROLE INFORMATION  ${ emojies.user }` )
      .addField( 'Role Name', code( role.name ), true )
      .addField( 'Role ID', code( role.id ), true )
      .addField( 'Role Permissions', code( role.permissions.toArray().join( '\n' ) ) )
      .addField( 'Members', code( role.members.size ), true )
      .addField( 'Role Position', code( role.position ), true )
      .addField( 'Role Color', code( role.hexColor ), true )
      .addField( 'Role Created On', infoTime( role.createdAt ) )
      .setColor( role.hexColor );

    message.say( embed );
  }
}