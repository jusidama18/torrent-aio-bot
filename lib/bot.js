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
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// All Commands /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////// All Callbacks/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
    bot.on("message", async msg => {
    if (!msg.document) return;
    const chatId = msg.chat.id;
    const mimeType = msg.document.mimeType;
    const fileName = msg.document.file_name;
    const fileId = msg.document.file_id;

    bot.sendMessage(chatId, "Uploading file...");
    try {
      const uploadedFile = await uploadFileStream(fileName, bot.getFileStream(fileId));
      const driveId = uploadedFile.data.id;
      const driveLink = `https://drive.google.com/file/d/${driveId}/view?usp=sharing`;
      const publicLink = `${process.env.SITE}api/v1/drive/file/${fileName}?id=${driveId}`;
      bot.sendMessage(chatId, `${fileName} upload successful\nDrive link: ${driveLink}\nPublic link: ${publicLink}`);
    } catch (e) {
      bot.sendMessage(chatId, e.message || "An error occured");
    }
  });

  bot.onText(/\/server diskinfo (.+)/, async (msg, match) => {
    const from = msg.chat.id;
    const path = match[1];
    const info = await diskinfo(path);
    bot.sendMessage(from, info);
  });

  bot.onText(/\/server uptime/, async msg => {
    const from = msg.chat.id;
    bot.sendMessage(from, humanTime(process.uptime() * 1000));
  });

  bot.onText(/\/server status/, async msg => {
    const from = msg.chat.id;
    const currStatus = await status();
    bot.sendMessage(from, currStatus);
  });

  bot.onText(searchRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

    bot.sendMessage(from, "Searching...");

    const data = await axios(`${api}api/v1/search/${site}?query=${query}`).then(({ data }) => data);

    if (!data || data.error) {
      bot.sendMessage(from, "An error occured on server");
    } else if (!data.results || data.results.length === 0) {
      bot.sendMessage(from, "No results found.");
    } else if (data.results.length > 0) {
      let results1 = "";
      let results2 = "";
      let results3 = "";

      data.results.forEach((result, i) => {
        if (i <= 2) {
          results1 += `Name: ${result.name} \nSeeds: ${result.seeds} \nDetails: ${result.details} \nLink: ${result.link} \n\n`;
        } else if (2 < i && i <= 5) {
          results2 += `Name: ${result.name} \nSeeds: ${result.seeds} \nDetails: ${result.details} \nLink: ${result.link} \n\n`;
        } else if (5 < i && i <= 8) {
          results3 += `Name: ${result.name} \nSeeds: ${result.seeds} \nDetails: ${result.details} \nLink: ${result.link} \n\n`;
        }
      });

      bot.sendMessage(from, results1);
      bot.sendMessage(from, results2);
      bot.sendMessage(from, results3);
    }
  });

  bot.onText(detailsRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

    bot.sendMessage(from, "Loading...");

    const data = await axios(`${api}/details/${site}?query=${query}`).then(({ data }) => data);
    if (!data || data.error) {
      bot.sendMessage(from, "An error occured");
    } else if (data.torrent) {
      const torrent = data.torrent;
      let result1 = "";
      let result2 = "";

      result1 += `Title: ${torrent.title} \n\nInfo: ${torrent.info}`;
      torrent.details.forEach(item => {
        result2 += `${item.infoTitle} ${item.infoText} \n\n`;
      });
      result2 += "Magnet Link:";

      await bot.sendMessage(from, result1);
      await bot.sendMessage(from, result2);
      await bot.sendMessage(from, torrent.downloadLink);
    }
  });

  bot.onText(downloadRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];
    let messageObj = null;
    let torrInterv = null;

    const reply = async torr => {
      let mess1 = "";
      mess1 += `Name: ${torr.name}\n\n`;
      mess1 += `Status: ${torr.status}\n\n`;
      mess1 += `Size: ${torr.total}\n\n`;
      if (!torr.done) {
        mess1 += `Downloaded: ${torr.downloaded}\n\n`;
        mess1 += `Speed: ${torr.speed}\n\n`;
        mess1 += `Progress: ${torr.progress}%\n\n`;
        mess1 += `Time Remaining: ${torr.redableTimeRemaining}\n\n`;
      } else {
        mess1 += `Link: ${torr.downloadLink}\n\n`;
        clearInterval(torrInterv);
        torrInterv = null;
      }
      mess1 += `Magnet URI: ${torr.magnetURI}`;
      try {
        if (messageObj) {
          if (messageObj.text !== mess1) bot.editMessageText(mess1, { chat_id: messageObj.chat.id, message_id: messageObj.message_id });
        } else messageObj = await bot.sendMessage(from, mess1);
      } catch (e) {
        console.log(e.message);
      }
    };

    const onDriveUpload = (torr, url) => bot.sendMessage(from, `${torr.name} uploaded to drive\n${url}`);
    const onDriveUploadStart = torr => bot.sendMessage(from, `Uploading ${torr.name} to gdrive`);

    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Link is not a magnet link");
    } else {
      bot.sendMessage(from, "Starting download...");
      try {
        const torren = torrent.download(
          link,
          torr => reply(torr),
          torr => reply(torr),
          onDriveUpload,
          onDriveUploadStart
        );
        torrInterv = setInterval(() => reply(torrent.statusLoader(torren)), 5000);
      } catch (e) {
        bot.sendMessage(from, "An error occured\n" + e.message);
      }
    }
  });

  bot.onText(statusRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    const torr = torrent.get(link);
    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Link is not a magnet link");
    } else if (!torr) {
      bot.sendMessage(from, "Not downloading please add");
    } else {
      let mess1 = "";
      mess1 += `Name: ${torr.name}\n\n`;
      mess1 += `Status: ${torr.status}\n\n`;
      mess1 += `Size: ${torr.total}\n\n`;
      if (!torr.done) {
        mess1 += `Downloaded: ${torr.downloaded}\n\n`;
        mess1 += `Speed: ${torr.speed}\n\n`;
        mess1 += `Progress: ${torr.progress}\n\n`;
        mess1 += `Time Remaining: ${torr.redableTimeRemaining}\n\n`;
      } else {
        mess1 += `Link: ${torr.downloadLink}\n\n`;
      }
      mess1 += `Magnet URI: ${torr.magnetURI}`;
      bot.sendMessage(from, mess1);
    }
  });

  bot.onText(removeRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    try {
      torrent.remove(link);
      bot.sendMessage(from, "Removed");
    } catch (e) {
      bot.sendMessage(from, `${e.message}`);
    }
  });
}

module.exports = bot;
