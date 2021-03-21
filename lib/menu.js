const axios = require("axios");

const status = require("../utils/status");
const diskinfo = require("../utils/diskinfo");
const humanTime = require("../utils/humanTime");
const { uploadFileStream } = require("../utils/gdrive");

const api = process.env.SEARCH_SITE || "https://torrent-aio-bot.herokuapp.com/";
console.log("Using api: ", api);

const searchRegex = /\/search (piratebay|limetorrent|1337x) (.+)/;
const detailsRegex = /\/details (piratebay|limetorrent|1337x) (.+)/;
const downloadRegex = /\/download (.+)/;
const statusRegex = /\/status (.+)/;
const removeRegex = /\/remove (.+)/;

function bot(torrent, bot) {
  bot.onText(/\/start/, async msg => {
  const opts = {
    reply_markup:{
      inline_keyboard: [
        [
          {
            text: 'Follow Our Channel 🔥',
            url: 'https://t.me/Jusidama'
          }
        ],
        [
          {
            text: 'Drive Index 🗂',
            url: 'https://torrent.juicedama.workers.dev/0:'
          }
        ],
        [
          {
            text: 'Report Bugs 👾',
            url: 'https://t.me/JohnSean18'
          }
        ]
      ]
    },
    parse_mode: 'markdown'
  };
  bot.sendMessage(msg.from.id, `*Hey ${msg.from.first_name}*\n\n*Welcome to John Torrent Leech Bot, I Am a Assistant bot of magnet downloader*\n\n_I can downloading Telegram Files or Magnet Link and Upload it to our Google Drive Server with direct link 😎_\n\n_And please don't download big size more than 20GB_\n_Because bot can't upload it full and failed_\n_I recommend the file size around 10GB more or less_\n\n*☛  Do one By One don't spamming. Otherwise You will get Permenent Ban*\n\n*☛  Massive magnet strictly prohobited because often failed*\n\n*☛  Contact me if bot don't responding your command in Report Bugs below*\n\n☛  _See_ */help for More Info and Details!*`, opts);
  });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  bot.onText(/\/donate/, async msg => {
  const opts = {
    reply_markup:{
      inline_keyboard: [
        [
          {
            text: 'Donation Contact ✅',
            url: 'https://t.me/JohnSean18'
          }
        ],
        [
          {
            text: 'Share and Support ❤️',
            url: 'https://t.me/share/url?url=https://t.me/JSTorrent_Bot'
          }
        ]
      ]
    },
    parse_mode: 'markdown'
  };
  bot.sendMessage(msg.from.id, `*Thanks for showing interest in Donation.*\n\n_To Donate and Support me ${msg.from.first_name}, you can send any Amount as you wish 😇 _.\n\nYour Donation will keep our service alive`, opts);
  });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  bot.onText(/\/help/, async msg => {
  const opts = {
    reply_markup:{
      inline_keyboard: [
        [
          {
            text: 'Advanced Help 📓',
            url: 'https://telegra.ph/Advanced-Help-for-Jusidama-Torrent-Bot-03-18'
          }
        ],
        [
          {
            text: 'Follow our channel 💎',
            url: 'https://t.me/Jusidama'
          }
        ]
      ]
    },
    parse_mode: 'markdown'
  };
  bot.sendMessage(msg.from.id, "*/download {magnet link} -* _To start a download_\n*/status {magnet link} -* _To check status your magnet link._\n*/remove {magnet link} -* _To remove an already added torrent_\n*/server* - _To Check for server current space_\n*/donate* - _To give donation to keep our service alive_\n\n*You need click Join Team Drive below to get acces Google Drive link or you can get direct link by Drive Index too*\n\n*For Drive Index User and Pass please Reffer Advanced Help for More Assistance 👇*", opts);
  });
  //*/details {site} {link}* -_To Fetch the magnetic link_\n*
  //*/search {site} {query}* - _To search for torrents_
//////////////////////////////////////////////////////////////////////////////////////////////////////////
  bot.onText(/\/drive/, async msg => {
  const opts = {
    reply_markup:{
      inline_keyboard: [
        [
          {
            text: 'Google Drive Link 🗂',
            url: 'https://drive.google.com/drive/u/0/folders/0ABPa5xhyFYO0Uk9PVA'
          }
        ],
        [
          {
            text: 'Drive Index 🗂',
            url: 'https://torrent.juicedama.workers.dev/0:'
          }
        ],
        [
          {
            text: 'Join Team Drive 🗂',
            url: 'https://groups.google.com/u/0/g/jusidama-torrent-bot'
          }
        ]
      ]
    },
    parse_mode: 'markdown'
  };
  bot.sendMessage(msg.from.id, "*Click link below to get access to Our Google Drive link by Join Team Drive and after that you can see in your Google Drive Shared Drives and our Drive named with Torrent Bot, Use Drive Index for direct links for User and Pass check the bottom in Advance Help with /help\n\nSo please don't spam request access pleease 😬*", opts);
  });
