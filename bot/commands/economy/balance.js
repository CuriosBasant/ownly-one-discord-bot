import { Command } from 'discord.js-commando';

export default class BalanceCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'balance',
      aliases: [],
      group: 'economy',
      memberName: 'balance',
      description: '',
      args: [
        {
          key: 'member',
          type: 'member',
          prompt: 'Whom balance you want to check?',
          // default: false,
          // parse: ( member, message ) => member ? member : message.member,
        }
      ]
    } );
  }

  run ( message, { member } ) {
    console.log( member );


  }
}