import { OWNER_ID } from "../config";
import Moment from 'moment';

export function showOnConsole ( msg, data, type = 'error' ) {
  const text = `\n----------------------\n${ msg }\n----------------------\n`;
  console[type]( text, data );
}

export function reactEmojies ( message, array ) {
  if ( !array.length ) return;
  message.react( array.shift() ).then( () => reactEmojies( message, array ) );
}

export function isOwner ( user ) {
  return user.id == OWNER_ID;
}

// const options;
export async function confirm ( question, channel,
  { filter = () => true, max = 1, time = 60 } = {} ) {
  const message = await channel.send( question );
  message.react( emojies.thumbup ).then( () => message.react( emojies.thumbdown ) );

  return message.awaitReactions(
    ( reaction, user ) => {
      if ( user.bot || reaction.emoji.name != emojies.thumbup && reaction.emoji.name != emojies.thumbdown ) return false;
      if ( isOwner( user ) || filter( user, reaction ) ) return true;

      reaction.users.remove( user );
      return false;
    }, { max, time: time * 1000, errors: ['time'] }
  );
}

export class ReactionButton {
  constructor( message, emojies, { cooldown = 3, filter = () => true, onCollected = () => null } = {} ) {
    this.message = message;
    this.emojies = emojies;
    this.user = null;
    this.cooldown = new Cooldown( cooldown );
    this.collector = message.createReactionCollector(
      ( reaction, user ) => {
        if ( user.bot || !emojies.has( reaction.emoji.name ) ) return false;
        reaction.users.remove( user );

        return !this.cooldown.isRunning && filter( user, reaction );
      }, {}
    );

    this.collector.on( 'collect', ( reaction, user ) => {
      if ( !emojies.has( reaction.emoji.name ) ) return;
      this.user = user;
      this.cooldown.start();
      onCollected( user );
      emojies.get( reaction.emoji.name )();
      // reaction.users.remove( user );
    } );
    reactEmojies( this.message, [...emojies.keys()] );
  }
}

export class Cooldown {
  constructor( time ) {
    this.duration = time * 1000;
    this.isRunning = false;
  }
  start () {
    clearTimeout( this.isRunning );
    this.isRunning = setTimeout( () => this.stop(), this.duration );
  }
  stop () {
    this.isRunning = false;
  }

  restart () {
    this.stop();
    this.start();
  }
}
export const code = str => `\`\`\`${ str }\`\`\``;
export const infoTime = time => {
  const createdAt = Moment( time );
  return code( `${ createdAt.format( 'llll' ) } (${ createdAt.fromNow() })` );
};
export const emojies = {
  yt: '<:youtube:739480676604051537>',
  search: '🔎',
  thumbup: '👍',
  thumbdown: '👎',
  cross: '❌',
  nought: '⭕',
  pane: '⬛',
  manShrugging: '🤷‍♂️',
  fun: '😜',
  note: '🎵',
  money: '💸',
  config: '🛠️',
  misc: '🔰',
  premium: '💎',
  info: '📝',
  frame: '🖼️',
  mod: '👥',
  user: '👤',
  text: '🛡️',
  voice: '🔊',
  category: '📦',
  server: '💠',
  game: '🎮',
  a: '🇦', b: '🇧', c: '🇨', d: '🇩', e: '🇪',
  f: '🇫', g: '🇬', h: '🇭', i: '🇮', j: '🇯',
  k: '🇰', l: '🇱', m: '🇲', n: '🇳', o: '🇴',
  p: '🇵', q: '🇶', r: '🇷', s: '🇸', t: '🇹',
  u: '🇺', v: '🇻', w: '🇼', x: '🇽', y: '🇾',
  z: '🇿',
  0: '0⃣', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣',
  4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣',
  8: '8️⃣', 9: '9️⃣', 10: '🔟',
  '#': '#⃣',
  '*': '*⃣',
  '!': '❗',
  '?': '❓',
};