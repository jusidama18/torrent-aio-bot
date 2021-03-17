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
            text: 'Support Channel 🔥',
            url: 'https://t.me/Jusidama'
          }
        ],
        [
          {
            text: 'Report Bugs ✅',
            url: 'https://t.me/JohnSean18'
          }
        ]
      ]
    },
    parse_mode: 'Markdown'
  };
  bot.sendMessage(msg.from.id, "*Hai !!.*\n\n_Welcome to John Torrent Leech Bot..Am a Assistant bot of magnet_ [👉 This Channel 🔥](https://t.me/Jusidama). _Magnet links convert to direct link & Upload our Google Drive Server 😎_\n\n*☛  Do one By One . Otherwise You will get Permenent Ban*\n\n*☛ Massive magnet strictly prohobited*\n\n*☛ /help for more details..*", opts);
  });

  bot.onText(/\/donate/, async msg => {
  const opts = {
    reply_markup:{
      inline_keyboard: [
	[      
          {
            text: 'Google Pay 🔥',
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
    parse_mode: 'Markdown'
  };
  bot.sendMessage(msg.from.id, "*Thanks for showing interest in donation.*\n\n_To donate and support me you can send any amount as you wish 😇 _.\n\nPayment Options", opts);
  });

  bot.onText(/\/help/, async msg => {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Join Our Channel 🔥',
              // we shall check for this value when we listen
              // for "callback_query"
              callback_data: 'drive'
            }
          ]
        ]
      },
      parse_mode: 'Markdown'
    };
    bot.sendMessage(msg.from.id, "*Welcome, here are some commands to get you started* : \n\n*There are 3 sites available at the movement: piratebay, 1337x and limetorrent* \n\n1. *Convert Torrent Magnetic Link to Direct Download Link and Gdrive link* : \n/download {magnet link} - To start a download. \nExample: /download magnet:?xt=urn:btih:sdfasdfas \n\n2. *See Status of Process* : \n/status {magnet link} - To check status of a downloading torrent info hash is provided when torent download starts. \nExample: /status magnet:?xt=urn:btih:sdfasdfas \n\n3. *Remove or Cancel* : \n/remove {magnet link} - To remove an already added torrent. \nExample: /remove magnet:?xt=urn:btih:sdfasdfas \n\n4. *Searching Magnet* \n/search {site} {query} - To search for torrents query is what you want to search for \nExample : /search piratebay Chernobyl \n          /search piratebay Chernobyl 720p \n          /search 1337x Lust Stories \n\n5. *Get More Details* \n/details {site} {link} - To get details of torrent \nlink is the link to the torrent page \nExample : /details piratebay https://bayunblocked net/torrent/..... \n          /details 1337x https://1337x to/torrent/..... \n\n6. *Server status commands* \n* /server status \n* /server uptime \n* /server diskinfo \n\n_To upload a file send the file to this bot it will be uploaded directly to drive_ \n\nNote: To Download or Access Link files Go to [Here](https://torrent.juicedama.workers.dev/0:) \n\nJoin Telegram Channel For Updates: @Jusidama \nAlso Join Telegram Group for Chat Link In Our Channel ! \n\nHappy torrenting :)", opts);
  });
  
  bot.on('callback_query', async callbackQuery => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
    };
    let text;

    if (action === 'drive') {
      text = 'https://t.me/Jusidama';
    }

  bot.on("message", async msg => {
    if (!msg.document) return;
    const chatId = msg.chat.id;
    const mimeType = msg.document.mimeType;
    const fileName = msg.document.file_name;
    const fileId = msg.document.file_id;

    bot.sendMessage(chatId, "📤 Uploading file...");
    try {
      const uploadedFile = await uploadFileStream(fileName, bot.getFileStream(fileId));
      const driveId = uploadedFile.data.id;
      const driveLink = `https://drive.google.com/file/d/${driveId}/view?usp=sharing`;
      const publicLink = `${process.env.SITE}api/v1/drive/file/${fileName}?id=${driveId}`;
      bot.sendMessage(chatId, `${fileName} Upload Successful 📤\n\nPublic link: https://torrent.juicedama.workers.dev/0:/${fileName}`);
    } catch (e) {
      bot.sendMessage(chatId, e.message || "⚠️ An Error Occured ⚠️");
    }
  });

  bot.onText(/\/server/, async msg => {
    const from = msg.chat.id;
    const currStatus = await status();
    bot.sendMessage(from, currStatus);
  });

  bot.onText(searchRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

    bot.sendMessage(from, "Searching Now ⏳...");

    const data = await axios(`${api}api/v1/search/${site}?query=${query}`).then(({ data }) => data);

    if (!data || data.error) {
      bot.sendMessage(from, "⚠️ An Error Occured On Server ⚠️");
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

    bot.sendMessage(from, "🔄 Loading...");

    const data = await axios(`${api}/details/${site}?query=${query}`).then(({ data }) => data);
    if (!data || data.error) {
      bot.sendMessage(from, "⚠️ An Error Occured ⚠️");
    } else if (data.torrent) {
      const torrent = data.torrent;
      let result1 = "";
      let result2 = "";

      result1 += `Title : ${torrent.title} \n\nInfo: ${torrent.info}`;
      torrent.details.forEach(item => {
        result2 += `${item.infoTitle} ${item.infoText} \n\n`;
      });
      result2 += "Magnet Link 🧲 :";

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
      	mess1 += `Downloading 📥 : 〘${torr.progress}%〙\n\n`;
	mess1 += 'Name ⛕ : ${torr.name}\n\n`; 
      	mess1 += `Status ♾ : ${torr.status}\n\n`;
      	mess1 += `Size 🧲 : ${torr.total}\n\n`;
      if (!torr.done) {
        mess1 += `Downloaded ✔️: ${torr.downloaded}\n\n`;
        mess1 += `Speed 🚀: ${torr.speed}\n\n`;
        mess1 += `Progress 🧲: ${torr.progress}%\n\n`;
        mess1 += `Time Remaining ⏳: ${torr.redableTimeRemaining}\n\n`;
      } else {
        mess1 += `Link: ${torr.downloadLink}\n\n`;
        clearInterval(torrInterv);
        torrInterv = null;
      }
      mess1 += `Magnet URI 🧲 : ${torr.magnetURI}`;
      try {
        if (messageObj) {
          if (messageObj.text !== mess1) bot.editMessageText(mess1, { chat_id: messageObj.chat.id, message_id: messageObj.message_id });
        } else messageObj = await bot.sendMessage(from, mess1);
      } catch (e) {
        console.log(e.message);
      }
    };

    const onDriveUpload = (torr, url) => bot.sendMessage(from, `${torr.name} uploaded to Google Drive\n\n[Link For Download](https://torrent.juicedama.workers.dev/0:/${torr.name})`);
    const onDriveUploadStart = torr => bot.sendMessage(from, `Uploading ${torr.name} to Google Drive`);

    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "🚫 Link is not a Magnet link");
    } else {
      bot.sendMessage(from, "📥 Starting download...");
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
        bot.sendMessage(from, "⚠️ An Error Occured ⚠️\n" + e.message);
      }
    }
  });

  bot.onText(statusRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    const torr = torrent.get(link);
    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "🚫 Link is not a magnet link.");
    } else if (!torr) {
      bot.sendMessage(from, "🤷🏻 Not downloading please add.");
    } else {
      let mess1 = "";
      mess1 += `Name ⛕ : ${torr.name}\n\n`;
      mess1 += `Status ♾ : ${torr.status}\n\n`;
      mess1 += `Size 🧲 : ${torr.total}\n\n`;
      if (!torr.done) {
        mess1 += `Downloaded ✅ : ${torr.downloaded}\n\n`;
        mess1 += `Speed 🚀 : ${torr.speed}\n\n`;
        mess1 += `DownloadinG 📥 :〘${torr.progress}%`;
        mess1 += `Time Remaining 🕔 : ${torr.redableTimeRemaining}\n\n`
	mess1 += `Please /donate any amount you wish to keep this service alive!\n\n`;
      } else {
        mess1 += `[Link For Download](https://torrent.juicedama.workers.dev/0:/${torr.name})\n\n`;
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
      bot.sendMessage(from, "Removed Successfully ♻️");
    } catch (e) {
      bot.sendMessage(from, `${e.message}`);
    }
  });
}

module.exports = bot;
