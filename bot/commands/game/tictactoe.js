import { Command } from 'discord.js-commando';
import { MessageEmbed, MessageAttachment } from 'discord.js';
import { emojies, ReactionButton, confirm } from '../../Utilities';
import GameManager from '../../classes/GameManager';

const EMPTY = emojies.pane, CROSS = emojies.cross, NOUGHT = emojies.nought,
  SIZE = 4, INVALID = -1;

export default class TicTacToeCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'tictactoe',
      aliases: ['ttt', 'xo'],
      group: 'game',
      memberName: 'tictactoe',
      description: 'Let\'s you play the TicTacToe game!',
      clientPermissions: ['ADD_REACTIONS'],
      args: [
        {
          // default: msg => msg.client,
          key: 'opponent',
          type: 'member',
          prompt: 'Whom you want to play with?',
          // error: 'Declined!'
        }
      ],
      details: 'Tic-Tac-Toe is a paper-and-pencil game for two players, X and O, who take turns marking the spaces in a 3×3 grid. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner.'
    } );
  }

  run ( message, { opponent } ) {

    const game = new TicTacToe( message.channel, message.member, opponent );
    game.askToOpponent()
      .then( () => {
        message.say( `**${ opponent.displayName }** accepted the challenge!` );
        // console.log( TicTacToe.createArena(), game.getEmojies() );
        game.start( [CROSS, NOUGHT], game.getEmojies() );
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

class TicTacToe extends GameManager {
  constructor( channel, challenger, accepter ) {
    super( 'TicTacToe', channel, [challenger, accepter], TicTacToe.createArena(), toString );
  }
  placeMark ( at ) {
    if ( this.arena[at] != EMPTY ) return;
    this.moves++;
    this.arena[at] = this.active.token;

    if ( this.moves < 5 );
    else if ( this.checkWin( at ) ) {
      this.msgEmbed.say( `Aah! Good one **${ this.active.displayName }**, you WON.` );
      return this.terminate( `${ this.active.displayName } Wins!` );
    } else if ( this.moves > 8 ) {
      this.msgEmbed.say( 'Hmmm, I see the game has been **Drawn**!' );
      return this.terminate( 'Game Drawn!' );
    }
    this.switchTurn();
    this.updateEmbed( `${ this.active.displayName }'s Turn!` );
  }
  checkWin ( index ) {
    const directions = [1, SIZE, SIZE - 1, SIZE + 1];
    return directions.some( direction => this.checkLine( index - direction, index + direction, direction ) );
  }
  checkLine ( from, to, inc ) {
    for ( let i = from, counter = 0; i <= to; i += inc ) {
      if ( this.arena[i] == this.active.token ) {
        if ( ++counter == SIZE - 1 ) return true;
      }
      else counter = 0;
    }
    return false;
  }
  getEmojies () {
    const set = new Map();
    for ( let i = 0; i < 9; i++ ) {
      set.set( emojies[i + 1], () => this.placeMark( ( i / 3 | 0 ) + i ) );
    }
    return set;

    // eslint-disable-next-line no-unreachable
    return this.arena.slice( 0, -SIZE ).reduce( ( set, emj, i ) => {
      if ( emj == INVALID ) return set;
      return set.set( emojies[i + 1], () => this.placeMark( i ) );
    }, new Map() );
    /* const set = new Map();
    for ( let i = 0; i < SIZE * SIZE; i++ ) {
      set.set( emojies[i + 1], () => ticTacToe.placeMark( i ) );
    }
    return set; */
  }
  static createArena () {
    const arena = [];
    const arr = Array( SIZE - 1 ).fill( EMPTY ).concat( INVALID );
    for ( let i = 1; i < SIZE; i++ ) {
      arena.push( ...arr.slice() );
    }
    return arena.concat( Array( SIZE ).fill( INVALID ) );
  }
}

function toString ( arena ) {
  return arena.slice( 0, -SIZE ).reduce( ( str, emj ) => {
    return str += emj == INVALID ? '\n' : emj;
  }, '' );
}