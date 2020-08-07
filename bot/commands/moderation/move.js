import { Command } from 'discord.js-commando';
import { emojies } from "./../../Utilities";

export default class MoveCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'move',
      // aliases: '[]',
      group: 'moderation',
      memberName: 'move',
      description: 'Moves members to another specified channel',
      userPermissions: ['MOVE_MEMBERS'],
      clientPermissions: ['MOVE_MEMBERS'],
      args: [
        {
          key: 'targetVoiceChannel',
          type: 'voice-channel',
          prompt: 'Where to move the members?',
          error: 'I couldn\'t find that channel on this server. Please try again!',
        }, {
          default: false,
          key: 'members',
          type: 'member',
          prompt: 'Whom to move?',
          infinite: true,
        }
      ]
    } );
  }

  run ( message, { targetVoiceChannel, members } ) {
    const currentVoiceChannel = message.member.voice.channel;
    if ( !currentVoiceChannel ) return message.say( 'You need to connect to a vc' );
    let membersToMove = currentVoiceChannel.members;
    if ( members ) {
      membersToMove = membersToMove.filter( member => members.includes( member ) );
    }

    membersToMove.forEach( member => member.voice.setChannel( targetVoiceChannel ) );
    message.react( emojies.thumbup );
  }
}