import { Command } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';
import { emojies, ReactionButton, confirm, isOwner } from '../../Utilities';
import GameManager from '../../classes/GameManager';

const ROW = 7, COL = 8;
const EMPTY = emojies.pane, PLAYER_1 = emojies.red, PLAYER_2 = emojies.yellow,
  INVALID = -1, CONNECT_COUNT = 4;

export default class Connect4Command extends Command {
  constructor( client ) {
    super( client, {
      name: 'connect-four',
      aliases: ['con4', 'connect4', 'drop-four', 'drop4', 'four-up'],
      group: 'game',
      memberName: 'connectfour',
      description: 'Connect the four discs, in any direction',
      clientPermissions: ['ADD_REACTIONS'],
      args: [
        {
          // default: '698556330860085359',
          key: 'opponent',
          type: 'member',
          prompt: 'Whom you want to play with?'
        }
      ],
      details: 'Connect Four is a two-player connection board game, in which the players take turns dropping colored discs into a seven-column, six-row vertically suspended grid. The pieces occupies the lowest available space within the column. The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of one\'s own discs.'
    } );
  }

  async run ( message, { opponent } ) {
    // const msgEmbed = await message.say( new MessageEmbed() );
    const game = new ConnectFour( message.channel, message.member, opponent );
    game.askToOpponent()
      .then( () => {
        message.say( `**${ opponent.displayName }** accepted the challenge!` );
        game.start( [PLAYER_1, PLAYER_2], game.getEmojies() );
      } )
      .catch( reason => {
        if ( reason == 'decline' ) {
          message.say( `**${ opponent.displayName }** declined the challenge!` );
        } else if ( reason == 'no-response' ) {
          message.say( `No response from **${ opponent.displayName }**, game aborted!` );
        }
      } );
  }
}

class ConnectFour extends GameManager {
  ground = Array( COL - 1 ).fill( 0 ).map( ( _, i ) => i + ( ROW - 2 ) * COL );

  constructor( channel, challenger, accepter ) {
    super( 'Connect 4', channel, [challenger, accepter], ConnectFour.createArena(), toString );
  }

  placeOnCol ( col ) {
    if ( this.ground[col] < 0 ) return;
    this.moves++;
    this.arena[this.ground[col]] = this.active.token;

    if ( this.moves < 7 );
    else if ( this.checkWin( this.ground[col] ) ) {
      // console.log( 'yeee, jeet gyae!' );
      this.msgEmbed.say( `Aah! Good one **${ this.active.displayName }**, you WON.` );
      return this.terminate( `${ this.active.displayName } Wins!` );
    } else if ( this.moves == this.arena.length ) {
      this.msgEmbed.say( 'Hmmm, I see the game has been **Drawn**!' );
      return this.terminate( 'Game Drawn!' );
    }
    this.ground[col] -= COL;
    this.switchTurn();
    this.updateEmbed( `${ this.active.displayName }'s Turn!` );
  }

  checkWin ( index ) {
    console.log( 'Checking for:', index );
    const directions = [1, COL, COL - 1, COL + 1];
    return directions.some( direction => this.checkLine( index - 3 * direction, index + 3 * direction, direction ) );
  }

  checkLine ( from, to, inc ) {
    for ( let i = from, counter = 0; i <= to; i += inc ) {
      if ( this.arena[i] == this.active.token ) {
        if ( ++counter == CONNECT_COUNT ) return true;
      }
      else counter = 0;
    }
    return false;
  }
  getEmojies () {
    const set = new Map();

    for ( let i = 1; i < COL; i++ ) {
      set.set( emojies[i], () => this.placeOnCol( i - 1 ) );
    }
    return set;
  }
  static createArena () {
    const arena = [];
    const arr = Array( COL - 1 ).fill( EMPTY ).concat( INVALID );
    for ( let i = 1; i < ROW; i++ ) {
      arena.push( ...arr.slice() );
    }
    return arena.concat( Array( COL ).fill( INVALID ) );
  }
}

function toString ( arena ) {
  return arena.slice( 0, -COL ).reduce( ( str, emj ) => {
    return str += emj == INVALID ? '\n' : emj;
  }, '' );
}