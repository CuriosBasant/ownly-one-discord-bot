import { Command } from 'discord.js-commando';
import { MessageEmbed, MessageAttachment } from 'discord.js';
import { emojies, ReactionButton, confirm } from '../../Utilities';
import { OWNER_ID } from '../../../config';

const SIZE = 3;
const ARENA = Array( SIZE * SIZE );
const timeout = 20000;

const PANE = emojies.pane,
  CROSS = emojies.cross,
  NOUGHT = emojies.nought;

export default class TicTacToeCommand extends Command {
  channel = null;
  round = 0;
  players = [];
  embed = new MessageEmbed().setColor( '#00AfFF' );

  constructor( client ) {
    super( client, {
      name: 'tictactoe',
      aliases: ['ttt'],
      group: 'fun',
      memberName: 'tictactoe',
      description: 'Let\'s you play the TicTacToe game!',
      args: [
        {
          key: 'opponent',
          prompt: 'Whom you want to play with?',
          type: 'member',
          error: 'Declined!'
        }
      ]
    } );
  }

  async run ( message, { opponent } ) {
    this.channel = message.channel;
    this.players = [message.member, opponent];
    // return this.startGame( message, opponent );
    // eslint-disable-next-line no-unreachable
    confirm(
      `Hey **${ opponent.displayName }**, do you accept the TicTacToe challenge?`,
      message.channel,
      { filter: user => user == opponent.user || this.client.isOwner( user ) }
    ).then( collected => {
      const reaction = collected.first();
      if ( reaction.emoji.name === emojies.thumbup ) {
        this.startGame( message, opponent );
        // new TicTacToe( message.author, opponent, message.channel, this.round++ );
      } else if ( reaction.emoji.name === emojies.thumbdown ) {
        message.say( `**${ opponent.username }** declined the challenge!` );
      }
    } )
      .catch( () => message.say( `Game **ABORTED**, as **${ opponent.displayName }** didn't responded.` ) );

  }

  startGame ( message, opponent ) {
    message.say( `**${ opponent.displayName }** accepted the challenge!` );
    this.embed.setDescription( `${ message.member.displayName } v/s ${ opponent.displayName }` );
    this.playNextRound();


  }

  async playNextRound () {
    this.round++;
    this.moves = 0;
    this.arena = ARENA.slice().fill( PANE );

    this.embed
      .setAuthor( `TicTacToe | Round ${ this.round }`, this.client.user.displayAvatarURL() )
      ;

    [this.active, this.nonActive] = Math.random() < 0.5 ? this.players.slice().reverse() : this.players;
    [this.active.mark, this.nonActive.mark] = [CROSS, NOUGHT];

    this.drawBoard();
    this.embedMessage = await this.channel.send( this.embed.setFooter( `${ this.active.displayName } Won the toss!` ) );
    // this.embedMessage.edit( this.embed.setFooter( `${ this.active.displayName } Won the toss!` ) );

    this.reactionController = new ReactionButton( this.embedMessage, getEmojies( this ), {
      filter: ( user, reaction ) => {
        if ( user.id == this.active.id || user.id == OWNER_ID ) {
          reaction.remove();
          return true;
        }
      },
      cooldown: 2
    }
      ,
      { idle: timeout }
    );
    this.reactionController.collector.on( 'end', ( collected, reason ) => {
      if ( reason == 'idle' ) {
        this.embedMessage.say( `Haha **${ this.active.displayName }**, you're timeout!` );
        this.terminate( `${ this.nonActive.displayName } Wins!` );
      } else if ( reason == 'finish' ) {

      }
      this.askForNextRound();
    } );
  }

  askForNextRound () {
    // return this.playNextRound();
    // eslint-disable-next-line no-unreachable
    confirm(
      `Do you guyz want to play more?`,
      this.channel,
      {
        filter: user => this.players.some( member => member.user == user ),
        max: 2
      }
    ).then( collected => {
      const reaction = collected.first();
      const reactionDown = collected.find( reaction => reaction.emoji.name === emojies.thumbdown );
      if ( !reactionDown ) {
        this.playNextRound();
      } else {
        this.channel.send( `**${ reactionDown.users.last() }** is not playing anymore!` );
        this.displayResult();
      }
    } )
      .catch( () => {
        this.channel.send( `No response from you guyz, **Game Ended**.` );
        this.displayResult();
      } );
  }

  displayResult () {

  }

  drawBoard () {
    this.embed.spliceFields( 0, 1, { name: '\u200b', value: toString( this.arena ), } );
  }

  placeMark ( at ) {
    if ( this.arena[at] != PANE ) return;
    this.reactionController.collector.resetTimer( { idle: timeout } );
    this.moves++;
    this.arena[at] = this.active.mark;
    this.drawBoard();
    if ( this.moves < 5 );
    else if ( this.checkWin( at ) ) {
      this.embedMessage.channel.send( `Aah! Good one **${ this.active.displayName }**, you WON.` );
      return this.terminate( `${ this.active.displayName } Wins!` );
    } else if ( this.moves > 8 ) {
      this.embedMessage.channel.send( 'Hmmm, I see the game has been **Drawn**!' );
      return this.terminate( 'Game Drawn!' );
    }
    this.nextTurn();
  }

  nextTurn () {
    [this.active, this.nonActive] = [this.nonActive, this.active];
    this.embedMessage.edit( this.embed.setFooter( `${ this.active.displayName }'s turn`, this.active.user.displayAvatarURL() ) );
  }

  checkWin ( index ) {
    const hori = Math.floor( index / SIZE ) * SIZE;
    return (
      this.loopThrough( hori, hori + SIZE, 1 ) || // Horizontally
      this.loopThrough( index % SIZE, SIZE * SIZE, SIZE ) || // Vertically
      this.loopThrough( 0, SIZE * SIZE, SIZE + 1 ) || // Left Slope
      this.loopThrough( SIZE - 1, SIZE * SIZE - SIZE + 1, SIZE - 1 ) // Right Slope
    );
  }
  terminate ( reason ) {
    this.embedMessage.reactions.removeAll();
    this.reactionController.collector.stop( 'finish' );
    this.embedMessage.edit( this.embed.setFooter( reason ) );
  }

  /**
   * @private
   */
  loopThrough ( init, range, update ) {
    for ( ; init < range; init += update ) {
      if ( this.arena[init] != this.active.mark ) return false;
    }

    return true;
  }
}

function getEmojies ( ticTacToe ) {
  const set = new Map();
  for ( let i = 0; i < SIZE * SIZE; i++ ) {
    set.set( emojies[i + 1], () => ticTacToe.placeMark( i ) );
  }
  return set;
}

function toString ( arena ) {
  let str = '';
  for ( let i = 0, s = 0; i < SIZE; i++ ) {
    for ( let j = 0; j < SIZE; j++ ) {
      str += arena[s++];
    }
    str += '\n';
  }

  return str;
}