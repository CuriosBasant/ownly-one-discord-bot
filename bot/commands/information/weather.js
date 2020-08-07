import { Command } from 'discord.js-commando';
import weather from 'weather-js';
import { MessageEmbed } from 'discord.js';
import { code } from '../../Utilities';
import moment from 'moment';

export default class WeatherCommand extends Command {
  constructor( client ) {
    super( client, {
      name: 'weather',
      aliases: [],
      group: 'information',
      memberName: 'weather',
      description: '',
      argsType: 'single'
    } );
  }

  async run ( message, locationSearch ) {
    const { location, current, forecast } = await getWeather( locationSearch );
    const observationTime = moment( `${ current.date } ${ current.observationtime }` ).format( 'llll' );
    const embed = new MessageEmbed()
      .setTitle( `Weather in ${ location.name }` )
      .setThumbnail( current.imageUrl )
      .addField( 'Location Name', code( location.name ), true )
      .addField( 'Temperature', code( `${ current.temperature } °${ location.degreetype }, ${ current.skytext }` ), true )
      .addField( 'Geolocation', code( `${ location.lat }, ${ location.long }` ) )
      .addField( 'Humidity Level', code( current.humidity ), true )
      .addField( 'Wind Speed', code( current.winddisplay ), true )
      .addField( 'Observation Time', code( observationTime ) )
      ;
    // console.log( result );
    message.say( embed );
  }
}

let o = [
  {
    "location": {
      "name": "San Francisco, CA",
      "lat": "37.777",
      "long": "-122.42",
      "timezone": "-7",
      "alert": "",
      "degreetype": "F",
      "imagerelativeurl": "http://blob.weather.microsoft.com/static/weather4/en-us/"
    },
    "current": {
      "temperature": "70",
      "skycode": "32",
      "skytext": "Sunny",
      "date": "2017-03-14",
      "observationtime": "13:15:00",
      "observationpoint": "San Francisco, California",
      "feelslike": "70",
      "humidity": "59",
      "winddisplay": "3 mph West",
      "day": "Tuesday",
      "shortday": "Tue",
      "windspeed": "3 mph",
      "imageUrl": "http://blob.weather.microsoft.com/static/weather4/en-us/law/32.gif"
    },
    "forecast": [
      {
        "low": "52",
        "high": "69",
        "skycodeday": "31",
        "skytextday": "Clear",
        "date": "2017-03-13",
        "day": "Monday",
        "shortday": "Mon",
        "precip": ""
      },
      {
        "low": "52",
        "high": "70",
        "skycodeday": "34",
        "skytextday": "Mostly Sunny",
        "date": "2017-03-14",
        "day": "Tuesday",
        "shortday": "Tue",
        "precip": "10"
      },
      {
        "low": "56",
        "high": "63",
        "skycodeday": "26",
        "skytextday": "Cloudy",
        "date": "2017-03-15",
        "day": "Wednesday",
        "shortday": "Wed",
        "precip": "20"
      },
      {
        "low": "50",
        "high": "64",
        "skycodeday": "28",
        "skytextday": "Mostly Cloudy",
        "date": "2017-03-16",
        "day": "Thursday",
        "shortday": "Thu",
        "precip": "10"
      },
      {
        "low": "53",
        "high": "67",
        "skycodeday": "32",
        "skytextday": "Sunny",
        "date": "2017-03-17",
        "day": "Friday",
        "shortday": "Fri",
        "precip": "10"
      }
    ]
  }
];

function getWeather ( search ) {
  return new Promise( ( resolve, reject ) => {
    weather.find( { search, degreeType: 'C' }, ( err, result ) => {
      if ( err ) reject( err );
      else resolve( result[0] );
    } );
  } );
}