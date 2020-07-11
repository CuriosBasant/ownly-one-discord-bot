import ytdl from 'ytdl-core-discord';
import { MessageEmbed } from 'discord.js';

import { showOnConsole } from './../Utilities.js';
import ReactionButton from './../classes/ReactionButton.js';

const COLOR = {
  PAUSE: '#ffff00',
  PLAYING: '#00ff00',
  STOPPED: '#ff2222'
};

const BITRATE = 64, VOLUME = 1;


// export default MusicPlayer;

