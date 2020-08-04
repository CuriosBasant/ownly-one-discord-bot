

export default function ( oldMessage, newMessage ) {
  if ( oldMessage.author.bot ) return;
  const musicPlayer = this.SERVERS.get( oldMessage.guild.id );
  if ( !musicPlayer ) return;
  if ( musicPlayer.messageID == oldMessage.id ) {
    console.log( newMessage.content.slice( 3 ) );
    const sliceIndex = newMessage.content.indexOf( ' ' ) + 1;
    const songName = newMessage.content.slice( sliceIndex );
    musicPlayer.replaceLastSong( songName );
  }
}