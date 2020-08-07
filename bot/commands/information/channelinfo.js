import { Command } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';
import { emojies, code, infoTime } from '../../Utilities';

export default class ChannelinfoCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'channel-info',
      aliases: ['ci', 'cinfo'],
      group: 'information',
      memberName: 'channelinfo',
      description: 'Gives information of the provided channel.',
      args: [
        {
          key: 'channel',
          type: 'channel',
          prompt: 'What channel information you want?'
        }
      ]
    } );
  }

  run ( message, { channel } ) {
    const embed = new MessageEmbed()
      .setTitle( `${ emojies[channel.type] }  CHANNEL INFORMATION  ${ emojies[channel.type] }` )
      .addField( 'Channel Name', code( channel.name ), true )
      .addField( 'Channel ID', code( channel.id ), true );


    if ( channel.type == 'text' ) {
      embed.addField( 'Channel Topic', code( channel.topic || 'No Topic is Set' ) );
    } else if ( channel.type == 'voice' ) {
      embed.addField( `Members in this Channel [${ channel.members.size }]`, code(
        !channel.members.size ?
          'Nobody is in this Voice Channel' :
          channel.members.reduce( ( str, member ) => str += `${ member.displayName }\n`, '' )
      ) );
    } else if ( channel.type == 'category' ) {
      embed.addField( `Channels under this Category [${ channel.children.size }]`, code(
        !channel.children.size ?
          'No channels under this category' :
          channel.children.reduce( ( str, cnl ) => str += `${ cnl.name }\n`, '' )
      ) );
    }

    embed.addField( 'Channel Type', code( `${ channel.type[0].toUpperCase() }${ channel.type.slice( 1 ) } Channel` ), true )
      .addField( `Channel P${ channel.parent ? 'arent' : 'osition' }`, code( channel.parent ? channel.parent.name : channel.position ), true )
      .addField( 'Channel Create On', infoTime( channel.createdAt ) )
      ;

    message.say( embed );
  }
}

