import { Command } from 'discord.js-commando';
import { MessageEmbed } from 'discord.js';
import { emojies, code } from '../../Utilities';

export default class HelpCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'help',
      aliases: ['command', 'cmd', 'what-is'],
      group: 'util',
      memberName: 'help',
      description: 'Displays a list of available commands, or detailed information for a specific command.',
      args: [
        {
          key: 'command',
          type: 'command',
          default: false,
          prompt: 'What command you want information of?',
          description: 'Displays a list of available commands, or detailed information for a specified command.',
          format: '[command]',
          details: "The command may be part of a command name or a whole command name. If it isn't specified, all available commands will be listed.",
          examples: ['help', 'help prefix']
        }
      ]
    } );
  }

  run ( message, { command } ) {
    const helpEmbed = new MessageEmbed();
    if ( !command ) {
      helpEmbed.setTitle( `HERE ARE ALL OF MY COMMANDS` );
      const commands = [
        { em: emojies.config, nm: 'util' },
        { em: emojies.fun, nm: 'fun' },
        { em: emojies.game, nm: 'game' },
        { em: emojies.mod, nm: 'moderation' },
        { em: emojies.note, nm: 'music' },
        { em: emojies.info, nm: 'information' },
        { em: emojies.misc, nm: 'miscellaneous' },
        { em: emojies.frame, nm: 'image' },
        { em: emojies.money, nm: 'economy' },
      ];

      commands.forEach( obj => {
        const grp = this.client.registry.groups.get( obj.nm );
        if ( !grp ) return;
        const value = stringify( grp.commands );
        if ( !value ) return;
        helpEmbed.addField( `${ obj.em }  **${ grp.name }** Commands`, value );
      } );
    } else {
      helpEmbed
        .setTitle( `${ emojies.info } COMMAND INFORMATION ${ emojies.info }` )
        .addField( 'Name', code( command.name ), true )
        .addField( 'Aliases', code( command.aliases.join( ', ' ) || 'No aliases set' ), true )
        .addField( 'Description', code( command.description || 'No description set' ) )
        .addField( 'Group', code( command.group.name ), true )
        .addField( 'Format', code( command.format || 'No formatting required' ) )
        ;

      command.details && helpEmbed.addField( 'Details', code( command.details ) );
      // console.log( command );
    }



    message.say( helpEmbed );
  }
}

function stringify ( commands ) {
  return commands.reduce( ( str, command ) => {
    if ( command.hidden ) return str;
    return str += `\`${ command.client.commandPrefix }${ command.name }\` — ${ command.description }\n`;
  }, '' );
}