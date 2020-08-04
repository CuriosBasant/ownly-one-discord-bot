export default function ( oldState, state ) {
  if ( state.member.user.bot ) return;

  if ( !oldState.channel ) onMemberJoin( oldState.member );
  else if ( !state.channel ) onMemberLeave( state.member );
}

function onMemberJoin ( member ) {

}


function onMemberLeave ( member ) {
  const player = member.client.SERVERS.get( member.guild.id );
  if ( !player ) return;

  const channelMembers = player.voiceChannel.members;
  if ( channelMembers.size == 1 && channelMembers.first().id == member.client.user.id ) {

    player.voiceChannel.leave();
  }
}