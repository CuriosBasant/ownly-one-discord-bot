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
          type: 'channel',
          prompt: 'Where to move the members?',
          parse: ( channelName, message ) => message.guild.channels.cache
            .find( channel => channel.type == 'voice' && channel.name.toLowerCase().includes( channelName.toLowerCase() ) ),
          error: 'That channel doesnot exist in this server. Please try again!',
          // validate: value => value,
        }
      ]
    } );
  }

  run ( message, { targetVoiceChannel } ) {
    const currentVoiceChannel = message.member.voice.channel;
    let membersToMove = currentVoiceChannel.members;

    // membersToMove = message.mentions.members; //.filter( member => currentVoiceChannel.members.has( member.id ) );

    membersToMove.forEach( member => member.voice.setChannel( targetVoiceChannel ) );
    message.react( emojies.thumbup );
  }
}