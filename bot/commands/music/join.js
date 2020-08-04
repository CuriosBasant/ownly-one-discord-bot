import { Command } from 'discord.js-commando';

export default class JoinCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'join',
      aliases: [],
      group: 'music',
      memberName: 'join',
      description: '',
    } );
  }

  run ( message, ) {
    this.join( message.member.voice.channel );
  }

  async join ( voiceChannel ) {
    const connection = await voiceChannel.join();
    return connection;
  }
}