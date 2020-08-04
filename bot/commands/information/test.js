import { Command } from 'discord.js-commando';
import { MessageEmbed, Message } from 'discord.js';
import { confirm, emojies } from '../../Utilities';

export default class TestCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'test',
      aliases: [],
      group: 'information',
      ownerOnly: true,
      memberName: 'test',
      description: 'Just Some testing stuff',
      args: [
        {
          default: 'a default value',
          key: 'text',
          type: 'integer|string',
          prompt: 'What can I test for you?',
          // parse: () => 'hello this is me'
        }
      ]
    } );
  }

  run ( message, { text } ) {
    this.testEmoji( message, text );
  }

  testEmoji ( message, text ) {
    const emoji = this.client.emojis.cache.get( emojies.yt );
    message.react( emojies.yt );
    message.say( `${ emojies.yt }` );
  }

  testVC ( message, text ) {
    console.log( message.guild.voice );
    console.log( '----------------------' );
    console.log( message.guild.voice.connection );
  }

  testAnotherCmd ( message, text ) {
    const customMessage = new Message( message.client, { content: ';ping' }, message.channel );
    const pingCmd = this.client.registry.commands.get( 'ping' );
    pingCmd.run( customMessage );
  }

  async testConfirm ( message, text ) {
    const hi = await confirm( text, message.channel, { time: 10 } )/* ;
    hi.then( collected => {
      console.log( collected.size );
    } ) */.catch( reason => console.log( 'aborted', reason ) );
    console.log( hi );
  }

  testHelp ( message ) {
    const prefix = 'mb';
    const botCommandList = [
      { name: 'invite', description: 'invite the bot to your server' },
      { name: 'memberscount', description: 'see how many members are in your server' },
      { name: 'mbmembers', description: 'see all the members in all the servers that Multi-bots in' },
      { name: 'help', description: 'see the bot commands' },
      { name: 'ping', description: 'check the bot ping' },
    ];
    const adminCommandList = [
      // Admin Commands here
      { name: 'poll', description: 'make a poll(suggestion)' },
    ];

    const helpEmbed = new MessageEmbed()
      .addField( 'Bot Commands', stringify( botCommandList ) )
      .addField( 'Admin Commands', stringify( adminCommandList ) );

    function stringify ( commandList ) {
      const valueList = commandList.map( command => `\`${ prefix } ${ command.name }\` - ${ command.description }` );
      return valueList.join( '\n' );
    }

    message.say( helpEmbed );
  }
}