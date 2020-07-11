import Cooldown from './Cooldown.js';

const property = {
  sequence: false,
  cooldown: 3
};

class ReactionButton {
  constructor( message, emojies, filter, options = {} ) {
    this.message = message;
    this.emojies = emojies;
    this.user = null;
    this.cooldown = new Cooldown( property.cooldown );
    this.collector = message.createReactionCollector(
      ( reaction, user ) => {
        if ( user.bot || !emojies.has( reaction.emoji.name ) ) return false;
        reaction.users.remove( user );

        return !this.cooldown.isRunning && filter( reaction, user );
      }, options
    );

    this.collector.on( 'collect', ( reaction, user ) => {
      if ( !emojies.has( reaction.emoji.name ) ) return;
      this.user = user;
      this.cooldown.start();
      emojies.get( reaction.emoji.name )();
      reaction.users.remove( user );
    } );
    this.addReactions( [...emojies.keys()] );
  }

  addReactions ( emojies ) {
    if ( !emojies.length ) return;
    this.message.react( emojies.shift() ).then( () => this.addReactions( emojies ) );
  }
}

export default ReactionButton;



/* "ffmpeg-static": "^4.1.0", */