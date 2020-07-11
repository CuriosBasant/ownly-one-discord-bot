import { Command } from 'discord.js-commando';

const methods = new Map()
  .set( 'add', ( role, member ) => {
    // members.each( async member => member.addRole( role ) );
    member.roles.add( role );
  } )
  .set( 'remove', ( role, member ) => {
    // members.each( async member => member.removeRole( role ) );
    member.roles.remove( role );
  } )
  .set( 'create', role => {

  } )
  .set( 'delete', role => {

  } )
  .set( 'modify', role => {

  } )
  .set( '_', role => {

  } );

export default class RoleCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'role',
      aliases: [],
      group: 'moderation',
      memberName: 'role',
      description: 'Creates, Removes roles',
      guildOnly: true,
      args: [
        {
          key: 'command',
          type: 'string',
          prompt: 'What to do?',
          oneOf: ['add', 'remove']
        }, {
          key: 'user',
          type: 'member',
          prompt: 'Mention someone!'
        }, {
          key: 'roleName',
          type: 'string',
          prompt: 'What role to access'
        }
      ],
      userPermissions: ['MANAGE_ROLES'],
      clientPermissions: ['MANAGE_ROLES'],
    } );
  }

  run ( message, { command, user, roleName } ) {
    const methodToRun = methods.get( command );

    const role = message.guild.roles.cache.find( role => role.name.toLowerCase().includes( roleName.toLowerCase() ) );

    // console.log( message.guild.members.cache.get( user.id ) );
    // const member = message.guild.members.cache.get( user.id );
    console.log( user );
    methodToRun( role, user );
  }
}