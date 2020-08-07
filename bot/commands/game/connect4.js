import { Command } from 'discord.js-commando';
import { emojies } from '../../Utilities';
import { MessageEmbed } from 'discord.js';
// import GameManager from '../../classes/GameManager';

const ROW = 6, COL = 7;
const EMPTY = emojies.pane, PLAYER_1 = 1, PLAYER_2 = 2;
const ARENA = Array( ROW * COL ).fill( EMPTY );

export default class Connect4Command extends Command {
  constructor( client ) {
    super( client, {
      name: 'connect4',
      aliases: ['con4'],
      group: 'game',
      memberName: 'connect4',
      description: '',
      hidden: true,
      args: [
        {
          default: false,
          key: 'opponent',
          type: 'member',
          prompt: 'Whom you want to play with?'
        }
      ]
    } );
  }

  async run ( message, { opponent } ) {
    const embed = new MessageEmbed();
    const msgEmbed = await message.say( embed );
    const game = new Connect4( [message.member, opponent], msgEmbed );
  }
}

class Connect4 {
  arena = ARENA.slice();
  ground = Array( COL ).fill( 0 ).map( ( _, i ) => i + ( ROW - 1 ) * COL );
  bool = Math.random() < .5;

  constructor( players, msgEmbed ) {
    this.players = players;
    this.msgEmbed = msgEmbed;
    this.embed = msgEmbed.embeds[0];
  }

  placeOnCol ( col, mark ) {
    if ( this.ground[col] < 0 ) return;
    this.arena[this.ground[col]] = mark;


    this.ground[col] -= COL;

  }

  startGame () {
    this.switchTurn();
  }

  drawEmbed () {
    this.embed.spliceFields( 0, 1, { name: '\u200b', value: this.toString(), } );
  }

  switchTurn () {
    this.bool = !this.bool;
    this.active = this.opponent;
  }

  get opponent () {
    return this.players[+!this.bool];
  }

  toString () {
    let str = '';
    for ( let i = 0, s = 0; i < ROW; i++ ) {
      for ( let j = 0; j < COL; j++ ) {
        str += this.arena[s++];
      }
      str += '\n';
    }

    return str;
  }
}

function getEmojies ( game ) {
  const set = new Map();

  for ( let i = 0; i < COL; i++ ) {
    set.set( emojies[i + 1], () => game.placeMark( i ) );
  }
  return set;
}