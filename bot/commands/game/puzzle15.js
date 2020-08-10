import { Command } from 'discord.js-commando';
import GameManager from '../../classes/GameManager';
import { MessageEmbed } from 'discord.js';
import { ReactionButton, emojies, code } from '../../Utilities';

const SIZE = 4, INVALID = -1;

export default class Puzzle15Command extends Command {
  constructor( client ) {
    super( client, {
      name: 'puzzle15',
      aliases: ['pzl'],
      group: 'game',
      memberName: 'puzzle15',
      description: '',
      details: 'The 15-puzzle is a sliding puzzle that consists of a frame of numbered square tiles in random order with one tile missing. The puzzle also exists in other sizes, particularly the smaller 8-puzzle.',
      hidden: true,
    } );
  }

  run ( message, ) {
    const game = new Puzzle15( message.channel, message.member );
    game.start();
    // game.start( [PLAYER_1, PLAYER_2], game.getEmojies() );

    return message;
  }
}

class Puzzle15 /* extends GameManager */ {
  moveCount = 0;
  blank = SIZE * SIZE - 1;
  arena = Array.from( { length: this.blank } ).map( ( _, i ) => emojies[String.fromCharCode( 97 + i )] ).concat( emojies.pane );

  constructor( channel, player ) {
    this.channel = channel;
    this.player = player;
  }

  async start () {
    this.startTime = Date.now();
    this.embed = new MessageEmbed()
      .setAuthor( 'Puzzle | Level 1', this.channel.client.user.displayAvatarURL( { size: 64 } ) );
    this.msgEmbed = await this.channel.send( this.embed );

    this.reactionController = new ReactionButton( this.msgEmbed, getEmojies( this ), {
      filter: user => user.id == this.player.id,
      cooldown: 2,
    } );
    this.reactionController.collector.on( 'end', ( collected, reason ) => {
      if ( reason == 'idle' ) {
        this.msgEmbed.say( `Haha **${ this.active.displayName }**, you're timeout!` );
        this.terminate( `${ this.opponent.displayName } Wins!` );
      } /* else if ( reason == 'finish' ) {

      } */

    } );

    this.shuffle();
    this.updateEmbed();
  }

  reset () {

  }

  shuffle () {
    this.isShuffling = true;
    const map = new Map()
      .set( 0, () => this.slideUp() )
      .set( 1, () => this.slideDown() )
      .set( 2, () => this.slideLeft() )
      .set( 3, () => this.slideRight() );

    for ( let i = 0; i < 50; i++ ) {
      map.get( Math.random() * 4 | 0 )();
    }
    this.isShuffling = false;
  }

  slideUp () {
    if ( this.blank > this.arena.length - SIZE - 1 ) return;
    this.swapWithBlank( this.blank + SIZE );
  }
  slideDown () {
    if ( this.blank < SIZE ) return;
    this.swapWithBlank( this.blank - SIZE );
  }
  slideLeft () {
    if ( this.blank % SIZE == SIZE - 1 ) return;
    this.swapWithBlank( this.blank + 1 );
  }
  slideRight () {
    if ( this.blank % SIZE == 0 ) return;
    this.swapWithBlank( this.blank - 1 );
  }

  swapWithBlank ( ind ) {
    const temp = this.arena[ind];
    this.arena[ind] = this.arena[this.blank];
    this.arena[this.blank] = temp;
    this.blank = ind;

    if ( !this.isShuffling ) {
      this.moveCount++;
      this.updateEmbed();
    }
  }

  updateEmbed () {
    this.embed

      .spliceFields( 0, 2, [
        { name: 'Moves', value: code( this.moveCount ) },
        { name: '\u200b', value: this.toString(), }
      ] );
    // .setColor( this.active.token.color )
    // .setFooter( state, this.active.user.displayAvatarURL( { size: 32 } ) );
    this.msgEmbed.edit( this.embed );
  }

  toString () {
    const temp = this.arena.slice();
    for ( let i = 0; i < SIZE; i++ ) {
      temp.unshift( temp.splice( -SIZE ).join( ' ' ) );
    }
    return temp.join( '\n' );
  }

  static createArena () {
    const arena = [];
    const arr = Array( SIZE - 1 ).fill( 0 ).concat( INVALID );
    for ( let i = 1; i < SIZE; i++ ) {
      arena.push( ...arr.slice() );
    }
    return arena.concat( Array( SIZE ).fill( INVALID ) );
  }
}

function getEmojies ( game ) {
  return new Map()
    .set( emojies.arrowUp, () => game.slideUp() )
    .set( emojies.arrowDown, () => game.slideDown() )
    .set( emojies.arrowLeft, () => game.slideLeft() )
    .set( emojies.arrowRight, () => game.slideRight() )
    ;
}