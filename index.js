import { CommandoClient } from 'discord.js-commando';
import { Collection } from 'discord.js';
import { join } from 'path';

import { BOT_PREFIX, OWNER_ID, BOT_TOKEN } from './config';


const client = new CommandoClient( {
  commandPrefix: BOT_PREFIX,
  owner: OWNER_ID,
  // invite: 'https://discord.gg/bRCvFy9',
} );

client.SERVERS = new Collection();

client.registry
  .registerDefaults()
  .registerGroups( [
    ['fun', 'A Fun Group'],
    ['image', ''],
    ['information', ''],
    ['miscellaneous', ''],
    ['moderation', ''],
    ['music', 'Music Group'],
  ] )
  .registerCommandsIn( join( __dirname, './bot/commands' ) );

client.once( 'ready', () => {
  console.log( `\n--------------------\nLogged in as ${ client.user.tag }! (${ client.user.id })\n--------------------` );
  client.user.setActivity( 'with Commando' );
} );

client.on( 'error', console.error );

client.login( BOT_TOKEN );