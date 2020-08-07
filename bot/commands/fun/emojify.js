import { Command } from 'discord.js-commando';
import { emojies } from '../../Utilities';

export default class EmojifyCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'emojify',
      aliases: ['em', 'style', 'decorate'],
      group: 'fun',
      memberName: 'emojify',
      description: 'Emojifies the entered message.',
    } );
  }

  run ( message, text ) {
    const arr = text.trim().replace( /\s\s+/g, ' ' ).toLowerCase().split( '' );

    const emojifiedText = arr.reduce( ( str, letter ) => {
      return str += letter == ' ' ? '    ' :
        emojies[letter] ? emojies[letter] + ' ' : '';
      // const toAppend = emojies[letter];
      // return str += ( !toAppend ? '' : toAppend + ' ' );
    }, '' );

    message.say( emojifiedText );
  }
}