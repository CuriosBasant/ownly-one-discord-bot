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
    let emojifiedText = '';
    const formattedText = text.trim().replace( /\s\s+/g, ' ' ).toLowerCase();
    for ( const letter of formattedText ) {
      let toAppend = emojies[letter];
      if ( letter == ' ' ) toAppend = '   ';
      else if ( toAppend ) continue;

      emojifiedText += toAppend + ' ';
    }
    message.say( emojifiedText );
  }
}