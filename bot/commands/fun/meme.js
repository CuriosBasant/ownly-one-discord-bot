import { Command } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

export default class MemeCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'meme',
      aliases: ['funny', 'whatis'],
      group: 'fun',
      memberName: 'meme',
      description: 'Posts a random meme.',
    } );
  }

  async run ( message ) {
    const meme = await fetch( 'https://meme-api.herokuapp.com/gimme' ).then( response => response.json() );
    // const meme = data.data.memes[Math.random() * data.data.memes.length | 0];
    const embed = new MessageEmbed()
      .setColor( '#EFFF00' )
      .setTitle( meme.title )
      .setURL( meme.url )
      .setImage( meme.url );

    message.embed( embed );
  }
}