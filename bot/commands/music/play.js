import { Command } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';
import ytdl from 'ytdl-core-discord';
import YouTube from 'discord-youtube-api';

import { YOUTUBE_API_KEY } from './../../../config';
import { showOnConsole, ReactionButton, confirm, emojies } from './../../Utilities';

const youtube = new YouTube( YOUTUBE_API_KEY );
const BITRATE = 64, VOLUME = 1;
const connectionError = new Map()
  .set( 'time-out', 'Timeout! No response from you.' )
  .set( 'not-found', 'I don\'t find the voice channel you\'re connected in' )
  .set( 'declined', 'Ok, command cancelled' )
  .set( 'being-used', 'Sorry! I\'m already being used in a different voice channel' );

const COLOR = {
  PAUSE: '#ffff00',
  PLAYING: '#00ff00',
  NOT_PLAYING: '#FFA500',
  STOPPED: '#ff2222'
};

export default class PlayCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'play',
      aliases: ['p'],
      group: 'music',
      memberName: 'play',
      description: 'Starts playing a song from YouTube',
      clientPermissions: ['CONNECT', 'SPEAK', 'ADD_REACTIONS'],
      guildOnly: true,
      args: [
        {
          key: 'songName',
          type: 'integer|string',
          prompt: 'What song you want the bot to play?',
        },
      ],
    } );
  }

  async run ( message, { songName } ) {
    /* let voiceChannel = message.member.voice.channel;
    let player = message.client.SERVERS.get( message.guild.id );
    
    if (!voiceChannel) {
      voiceChannel = 
    } else {
      
    }
    
    
    if (!player) {
      
    } else {
      
    }
    
    if ( !voiceChannel ) {
      try {
        voiceChannel = await this.waitUserToJoinVC();
      } catch (error) {
        return;
      }
    } else if ( message.guild.voice ) {
      const botVC = message.guild.voice.channel;
      if ( botVC.members.size != 1 ) return;
    }

     */this.getUserVoiceChannel( message )
      .then( async voiceChannel => {
        console.log( 'haa mai chal raha hiu' );

        let player = message.client.SERVERS.get( message.guild.id );
        if ( !player ) {
          player = new MusicPlayer( message );
          await player.start( getEmojies( player ) );
          // console.log( 'Mai ab aaya' );

          message.client.SERVERS.set( message.guild.id, player );
        }

        if ( typeof songName == 'number' ) {
          player.playSong( songName );
        } else {
          await player.addSong( songName, message.member );
        }

        message.delete( { timeout: 30503 } );
      } )
      .catch( reason => { console.log( reason ); message.say( `${ emojies.cross } **${ connectionError.get( reason ) }.**` ); } );

  }

  /* waitUserToJoinVC () {

  }

  userHadJoinedVC ( voiceChannel ) {

  } */

  getUserVoiceChannel ( message ) {
    return new Promise( ( resolve, reject ) => {
      const checkVC = ( hadConfirmed = false ) => {
        const voiceChannel = message.member.voice.channel;
        if ( voiceChannel ) resolve( voiceChannel );
        else if ( hadConfirmed ) reject( 'not-found' );
        else if ( message.guild.voice ) {
          reject( 'being-used' );
        } else return true;
      };
      if ( !checkVC() ) return;

      confirm( 'Have you joined any Voice Channel?', message.channel, {
        time: 30,
        filter: user => user == message.author,
      } ).then( reactions => {
        const reaction = reactions.first();
        if ( reaction.emoji.name == emojies.thumbup ) {
          checkVC( true );
        } else if ( reaction.emoji.name == emojies.thumbdown ) {
          reject( 'declined' );
        }
      } ).catch( () => reject( 'time-out' ) );
    } );
  }
}

class MusicPlayer {
  currentSongIndex = -1;
  playlist = [];
  hasStopped = false;
  isRunning = false;
  repeatMode = 'OFF';
  dispatcher = null;
  messageID = null;

  constructor( message ) {
    this.rawEmbed = {
      log: '',
      status: 'PLAYING',
      seducer: message.client,
      color: COLOR.PLAYING,
      queueList: ''
    };
    this.serverID = message.guild.id;
    this.textChannel = message.channel;
    this.voiceChannel = message.member.voice.channel;
  }

  async start ( emojies ) {
    try {
      this.DJ = await this.textChannel.send( 'asdf',
        new MessageEmbed().setAuthor( 'Starting...', this.rawEmbed.seducer.user.displayAvatarURL( { size: 32, dynamic: true } ) )
      );
      this.voiceConnection = await this.voiceChannel.join();
    } catch ( err ) {
      console.error( err );
    }

    this.voiceConnection.on( 'disconnect', () => this.stop() );
    this.reactionController = new ReactionButton( this.DJ, emojies, {
      filter: user => this.voiceChannel.members.has( user.id ),
      onCollected: user => this.onCollected( user ),
      cooldown: 3
    } );
    // this.updateEmbed();
  }
  onCollected ( user ) {
    console.log( 'dekho dekho kon aaya' );
    const member = this.voiceChannel.members.get( user.id );
    this.rawEmbed.seducer = member;
  }

  async addSong ( songName, addedBy ) {
    this.rawEmbed.log = `${ emojies.yt } **Searching  ${ emojies.search } \` ${ songName } \`**`;
    this.messageID = addedBy.lastMessage.id;
    addedBy.lastMessage.delete( { timeout: 30503 } );

    const songData = await searchSong( songName, addedBy );

    if ( this.playlist.some( song => song.id == songData.id ) ) {
      return addedBy.lastMessage.say( 'That song already exist.' );
    }

    this.playlist[this.currentSongIndex + 1] = songData;
    this.rawEmbed.seducer = addedBy;

    if ( this.playlist.length != 1 ) {
      this.rawEmbed.status = 'New Song Added';
      this.showQueue();
    }
    if ( !this.isRunning ) {
      this.currentSongIndex = this.playlist.length - 1;
      this.play( this.currentSongIndex );
    }
  }

  async replaceLastSong ( songName ) {
    const lastSong = this.playlist.pop();
    const song = await searchSong( songName, lastSong.addedBy );
    this.playlist.push( song );

    if ( this.currentSongIndex == this.playlist.length - 1 ) {
      this.currentSongIndex--;
      this.dispatcher.end();
    }
  }

  updateEmbed () {
    const currentSong = this.playlist[this.currentSongIndex];
    const embed = new MessageEmbed()
      .setAuthor( this.rawEmbed.status, this.rawEmbed.seducer.user.displayAvatarURL( { dynamic: true, size: 32 } ) )
      .setColor( this.rawEmbed.color );
    if ( currentSong ) {
      embed
        .setTitle( currentSong.title )
        .setURL( currentSong.url )
        .setDescription( this.rawEmbed.queueList )
        .setThumbnail( currentSong.thumbnail )
        .addField( 'Repeat Mode', this.repeatMode, true )
        .addField( 'Song Duration', `${ currentSong.length } mins`, true )
        .addField( 'Song Position', `${ this.currentSongIndex + 1 } / ${ this.playlist.length }`, true )
        .setTimestamp( currentSong.addTime )
        .setFooter( `${ currentSong.addedBy.displayName }`, currentSong.addedBy.user.displayAvatarURL( { dynamic: true, size: 16 } ) );
    }
    this.DJ.edit( this.rawEmbed.log, embed );
  }

  /**
   * Plays the song!
   * @param {Integer} songIndex - The index of the song in playlist
  */
  async play ( songIndex ) {
    const song = this.playlist[songIndex];
    const stream = await ytdl( song.url, { highWaterMark: 1 << 25, bitrate: this.getBitrate() } );
    this.dispatcher = this.voiceConnection
      .play( stream, { type: 'opus', fec: true, volume: false/* , highWaterMark: 1 << 16 */ } )
      .on( 'debug', info => showOnConsole( 'Dispatcher Info:', info, 'info' ) )
      .on( 'error', err => showOnConsole( 'Dispatcher Error:', err, 'error' ) )
      .on( 'start', () => {
        this.isRunning = true;
        // this.rawEmbed.status = 'PLAYING';
        // this.rawEmbed.color = COLOR.PLAYING;
      } )
      .on( 'finish', () => {
        this.isRunning = false;
        !this.hasStopped && this.autoSkip();
      } );

    this.dispatcher.setVolumeLogarithmic( VOLUME );
    this.updateEmbed();
  }

  autoSkip () {
    if ( this.isQueueEmpty ) return this.onQueueEmpty();
    if ( this.repeatMode != 'ONE' ) {
      this.currentSongIndex++;
      if ( this.currentSongIndex < 0 ) this.currentSongIndex = this.playlist.length - 1;
      else if ( this.repeatMode == 'ALL' ) {
        this.currentSongIndex = this.currentSongIndex % this.playlist.length;
      } else if ( this.currentSongIndex >= this.playlist.length ) {
        this.currentSongIndex = this.playlist.length - 1;
        return this.onQueueFinish();
      }
    }
    this.play( this.currentSongIndex );
  }

  playSong ( index ) {
    if ( index > this.playlist.length ) index = this.playlist.length;
    else if ( index < 1 ) index = 1;
    this.currentSongIndex = index - 2;
    this.dispatcher.end();
  }

  toggleRepeat () {
    const modes = ['OFF', 'ALL', 'ONE', 'OFF'];
    this.repeatMode = modes[modes.indexOf( this.repeatMode ) + 1];
    this.rawEmbed.status = 'Repeat Toggled';
    this.updateEmbed();
  }

  pauseResume () {
    this[this.isPaused ? 'resume' : 'pause']();
    this.updateEmbed();
  }

  pause () {
    if ( this.isRunning ) {
      this.dispatcher.pause();
      this.rawEmbed.color = COLOR.PAUSE;
      this.rawEmbed.status = 'PAUSED';
    } else {
      this.replayQueue();
    }
    // console.log('Paused at :', this.dispatcher.streamTime);
  }

  resume () {
    this.rawEmbed.color = COLOR.PLAYING;
    this.rawEmbed.status = 'RESUMED';
    this.dispatcher.resume();
  }

  replayQueue ( bool = true ) {
    if ( this.isQueueEmpty ) return;
    if ( bool ) this.currentSongIndex = 0;
    this.rawEmbed.color = COLOR.PLAYING;
    this.rawEmbed.status = 'REPLAYING';
    this.play( this.currentSongIndex );
  }

  previous () {
    if ( this.isRunning ) {
      this.currentSongIndex -= 2;
      this.skip();
    } else {
      this.replayQueue( false );
    }
  }

  next () {
    if ( this.isRunning ) {
      this.skip();
    } else {
      this.replayQueue();
    }
  }

  skip () {
    if ( this.repeatMode == 'ONE' ) this.repeatMode = 'ALL';
    this.rawEmbed.status = 'SKIPPED';
    this.dispatcher.end();
  }

  onQueueFinish () {
    // this.isQueueFinished = true;
    this.rawEmbed.color = COLOR.NOT_PLAYING;
    this.rawEmbed.status = 'QUEUE FINISHED';
    this.updateEmbed();
  }

  onQueueEmpty () {
    this.rawEmbed.color = COLOR.NOT_PLAYING;
    this.rawEmbed.status = 'QUEUE EMPTIED';
    this.updateEmbed();
  }

  stop () {
    this.rawEmbed.status = 'STOPPED';
    this.rawEmbed.color = COLOR.STOPPED;
    this.rawEmbed.log = `Emptied the queue, \`${ this.playlist.length }\` track${ this.playlist.length > 1 ? 's' : '' } has been removed.`;
    this.updateEmbed();
    this.hasStopped = true;
    this.playlist = [];

    this.dispatcher.end();
    this.reactionController.collector.stop();
    this.DJ.reactions.removeAll();
    this.DJ.client.SERVERS.delete( this.serverID );
  }

  showQueue () {
    const list = this.playlist.map( ( song, i ) => `${ i + 1 }.  ${ song.title }` );
    list[this.currentSongIndex] = `**${ list[this.currentSongIndex] }**`;
    const add = ( str = '' ) => {
      this.rawEmbed.queueList = str;
      this.updateEmbed();
    };
    add( list.join( '\n' ) );
    setTimeout( add, 10000 );
  }

  /** 
   * @param {Number} songIndex - The index of song to be removed from the Queue
  */
  removeSong ( songIndex = this.currentSongIndex ) {
    const removedSong = this.playlist.splice( songIndex, 1 )[0];
    if ( !removedSong ) return;
    this.rawEmbed.status = 'Song Removed';
    if ( songIndex <= this.currentSongIndex ) this.currentSongIndex--;
    this.dispatcher.end();
  }

  getBitrate () {
    const vcBitrate = this.voiceChannel.bitrate;
    return vcBitrate < BITRATE ? vcBitrate : BITRATE;
  }

  get isPaused () {
    return this.dispatcher.paused;
  }
  get isQueueEmpty () {
    return !this.playlist.length;
  }
  get username () {
    const memberName = this.voiceChannel.members.get( this.reactionController.user.id ).displayName;
    // return  ? this.reactionController.user.username : '';
    return memberName;
  }
  /* get currentPlaybackPosition () {
    return Math.round( this.dispatcher.streamTime / 1000 );
  } */
}

async function searchSong ( songName, addedBy ) {
  const songData = await youtube.searchVideos( `${ songName }, music` )
    .catch( console.error );
  songData.addedBy = addedBy;
  songData.addTime = Date.now();
  return songData;
}

function getEmojies ( player ) {
  return new Map()
    .set( '🇶', () => player.showQueue() )
    .set( '🔁', () => player.toggleRepeat() )
    .set( '⏮️', () => player.previous() )
    .set( '⏯️', () => player.pauseResume() )
    .set( '⏭️', () => player.next() )
    .set( '🗑️', () => player.removeSong() )
    .set( '🛑', () => player.stop() );
}