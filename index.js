import { CommandoClient } from 'discord.js-commando';
import { Collection } from 'discord.js';
import { join } from 'path';
import fs from 'fs';

import { BOT_PREFIX, OWNER_ID, BOT_TOKEN, SERVER_INVITE_LINK } from './config';


const bot = new CommandoClient( {
  commandPrefix: BOT_PREFIX,
  owner: OWNER_ID,
  invite: SERVER_INVITE_LINK,
  // unknownCommandResponse: true,
  disableEveryone: true,
} );

bot.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands( { help: false } )
  // .registerDefaults()
  // .unregisterCommand(command)
  .registerGroups( [
    ['fun', 'Fun'],
    ['image', 'Image'],
    ['information', 'Information'],
    ['miscellaneous', 'Miscellaneous'],
    ['moderation', 'Moderation'],
    ['music', 'Music'],
    ['game', 'Game'],
    ['economy', 'Economy'],
  ] )
  .registerCommandsIn( join( __dirname, './bot/commands' ) );

bot.SERVERS = new Collection();

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