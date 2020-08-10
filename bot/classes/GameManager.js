import { MessageEmbed } from "discord.js";
import { confirm, isOwner, emojies, ReactionButton } from "../Utilities";

const TIME_OUT_DELAY = 20000;

export default class GameManager {
  moves = 0;
  bool = Math.random() < 0.5;

  constructor( name, channel, players, arena, toString ) {
    this.name = name;
    this.channel = channel;
    this.players = players;
    this.arena = arena;
    this.toString = toString;
  }

  askToOpponent () {
    return new Promise( ( resolve, reject ) => {
      // resolve();
      confirm(
        `Hey **${ this.players[1].displayName }**, do you accept the ${ this.name } challenge?`,
        this.channel,
        { filter: user => user == this.opponent.user || isOwner( user ) }
      ).then( collected => {
        const reaction = collected.first();
        if ( reaction.emoji.name === emojies.thumbup ) {
          resolve();
        } else if ( reaction.emoji.name === emojies.thumbdown ) {
          reject( 'decline' );
        }
      } ).catch( () => reject( 'no-response' ) );
    } );
  }

  async start ( tokens, emg ) {
    console.log( this.name, 'should work' );
    this.embed = new MessageEmbed();
    this.msgEmbed = await this.channel.send( this.embed );

    this.reactionController = new ReactionButton( this.msgEmbed, emg, {
      filter: user => user.id == this.active.id,
      cooldown: 2,
      idle: TIME_OUT_DELAY
    } );
    this.reactionController.collector.on( 'end', ( collected, reason ) => {
      if ( reason == 'idle' ) {
        this.msgEmbed.say( `Haha **${ this.active.displayName }**, you're timeout!` );
        this.terminate( `${ this.opponent.displayName } Wins!` );
      } /* else if ( reason == 'finish' ) {

      } */
      // this.askForNextRound();
    } );

    this.switchTurn();
    [this.active.token, this.opponent.token] = tokens;

    this.embed
      .setAuthor( this.name, this.msgEmbed.client.user.displayAvatarURL( { size: 64 } ) )
      .setDescription( `${ this.active.displayName } v/s ${ this.opponent.displayName }` );
    this.updateEmbed( `${ this.active.displayName }'s Turn!` );
  }

  switchTurn () {
    this.reactionController.collector.resetTimer( { idle: TIME_OUT_DELAY } );
    this.active = this.opponent;
    this.bool = !this.bool;
  }

  updateEmbed ( state ) {
    this.embed.spliceFields( 0, 1, { name: '\u200b', value: this.toString( this.arena ), } )
      // .setColor( this.active.token.color )
      .setFooter( state, this.active.user.displayAvatarURL( { size: 32 } ) );
    this.msgEmbed.edit( this.embed );
  }

  get opponent () {
    return this.players[+!this.bool];
  }

  terminate ( reason ) {
    this.msgEmbed.reactions.removeAll();
    this.reactionController.collector.stop( 'finish' );
    this.updateEmbed( reason );
  }
}