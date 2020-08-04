import { Command } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';
import { emojies, reactEmojies } from '../../Utilities';

export default class PollCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'poll',
      aliases: ['ask'],
      group: 'miscellaneous',
      memberName: 'poll',
      description: '',
      args: [
        {
          key: 'text',
          type: 'string',
          prompt: 'On what query you want to create a poll on?',
          parse: text => text.trim().replace( / +/g, ' ' )
        }
      ]
    } );
  }

  run ( message, { text } ) {
    console.log( text );
    const leftBracePosition = text.indexOf( '{' );
    if ( leftBracePosition == -1 ) {
      reactEmojies( message, [emojies.thumbup, emojies.manShrugging, emojies.thumbdown] );
    } else {
      const question = text.slice( 0, leftBracePosition );
      const options = text.slice( leftBracePosition + 1, -1 ).replace( /} {/g, '}{' ).split( '}{' );
      // console.log( question, '\n', options );
      const pollEmbed = new MessageEmbed().setTitle( question );
      const abcd = [];
      options.forEach( ( option, index ) => {
        const emoji = emojies[String.fromCharCode( 97 + index )];
        abcd.push( emoji );
        pollEmbed.addField( '\u200B', `${ emoji } ${ option }` );
      } );
      message.say( pollEmbed ).then( msg => reactEmojies( msg, abcd ) );
    }

  }
}