if ( process.env.NODE_ENV == 'development' ) {
  require( 'dotenv' ).config( { path: './private/.env' } );
}

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const BOT_PREFIX = process.env.BOT_PREFIX;
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
export const OWNER_ID = process.env.OWNER_ID;
export const SERVER_INVITE_LINK = 'https://discord.gg/uW82j6S';
// export const SERVER_INVITE_LINK = process.env.SERVER_INVITE_LINK;