import { CommandoClient } from 'discord.js-commando';
import { Collection } from 'discord.js';
import { join } from 'path';
import fs from 'fs';

import { BOT_PREFIX, OWNER_ID, BOT_TOKEN } from './config';


const bot = new CommandoClient( {
  commandPrefix: BOT_PREFIX,
  owner: OWNER_ID,
  invite: 'https://discord.gg/uW82j6S',
  // unknownCommandResponse: true,
  disableEveryone: true,
} );

bot.SERVERS = new Collection();

bot.registry
  .registerDefaults()
  .registerGroups( [
    ['fun', 'A Fun Group'],
    ['image', ''],
    ['information', ''],
    ['miscellaneous', ''],
    ['moderation', 'Moderation'],
    ['music', 'Music Group'],
    ['economy', 'Economy'],
  ] )
  .registerCommandsIn( join( __dirname, './bot/commands' ) );

fs.readdir( './bot/events', ( err, files ) => {
  if ( err ) return console.error;
  for ( const file of files ) {
    if ( !file.endsWith( '.js' ) ) continue;
    const event = require( `./bot/events/${ file }` ).default;
    bot.on( file.slice( 0, -3 ), event.bind( bot ) );
  }
} );

bot.once( 'ready', () => {
  console.log( `\n--------------------\nLogged in as ${ bot.user.tag }! (${ bot.user.id })\n--------------------` );
  bot.user.setActivity( 'with Commando' );
} );

bot.on( 'error', console.error );

bot.login( BOT_TOKEN );