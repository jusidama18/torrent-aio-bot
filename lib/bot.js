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
            text: 'Follow Our Channel',
            url: 'https://t.me/Jusidama'
          }
        ],
        [
          {
            text: 'Drive Index',
            url: 'https://torrent.juicedama.workers.dev/0:'
          }
        ],
        [
          {
            text: 'Report Bugs',
            url: 'https://t.me/JohnSean18'
          }
        ]
      ]
    },
    parse_mode: 'markdown'
  };
  bot.sendMessage(msg.from.id, `Hey ${msg.from.first_name} Welcome to John Torrent Leech Bot, I Am a Assistant bot of magnet,\n\n_I can Torrent Files or Magnet Link and Upload it to our Google Drive Server with direct link 😎_\n\n*☛  Do one By One . Otherwise You will get Permenent Ban*\n\n*☛ Massive magnet strictly prohobited*\n\n_See_ */help for More Info and Details!*`, opts);
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
  bot.sendMessage(msg.from.id, "*Thanks for showing interest in Donation.*\n\n_To Donate and Support me ${msg.from.first_name}, you can send any Amount as you wish 😇 _.\n\nYour Donation will keep our service alive", opts);
  });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  bot.onText(/\/help/, async msg => {
    const opts = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Drive Index',
                url: 'https://torrent.juicedama.workers.dev/0:'
              }
            ],
            [
              {
                text: 'Advanced Help',
                callback_data: 'advancedhelp'
              }
            ]
          ]
        },
      },
      parse_mode: 'Markdown'
    };
    bot.sendMessage(msg.from.id, "*/search {site} {query}* - _To search for torrents_\n*/details {site} {link}* -_To Fetch the magnetic link_\n*/download {magnet link} -* _To start a download_\n*/status {magnet link} -* _To check status of a downloading torrent._\n*/remove {magnet link} -* _To remove an already added torrent_\n\n*Please Reffer Advanced Help for More Assistance 👇*", opts);
  });
//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// All Callbacks/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
  bot.on('callback_query', async callbackQuery => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Join Group',
              callback_data: 'group'
            }
          ],
          [
            {
              text: 'Goto Drive',
              callback_data: 'drivelink'
            }
          ],
          [
            {
              text: 'Back',
              callback_data: 'help'
            },
            {
              text: 'Close',
              callback_data: 'close'
            }
          ]
        ]
      },
      parse_mode: 'markdown',
      message_id: msg.message_id
    };
    let text;

    if (action === 'drive') {
      text = 'You will have to Join our Team Drive For *Accessing and Downloading Files from Google Drive.*\n_To Join our Team Drive, Join Our Google Group and you are Good to go!';
    }

    bot.editMessage(callbackQuery.chat.id, text, opts);
  });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  bot.on('callback_query', async callbackQuery => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Join our Team Drive',
              callback_data: 'drive'
            }
          ],
          [
            {
              text: 'Advanced Help',
              callback_data: 'advancedhelp'
            }
          ]
        ]
      },
      parse_mode: 'markdown',
      message_id: msg.message_id,
    };
    let text;

    if (action === 'help') {
      text = '*/search {site} {query}* - _To search for torrents_\n*/details {site} {link}* -_To Fetch the magnetic link_\n*/download {magnet link} -* _To start a download_\n*/status {magnet link} -* _To check status of a downloading torrent._\n*/remove {magnet link} -* _To remove an already added torrent_\n\n*Please Reffer Advanced Help for More Assistance 👇*';
    }

    bot.editMessage(callbackQuery.chat.id, text, opts);
  });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  bot.on('callback_query', async callbackQuery => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
      message_id: msg.message_id
    };
    if (action === 'close')

    bot.deleteMessage(callbackQuery.chat.id, opts);
  });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  bot.on('callback_query', async callbackQuery => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Get Link',
              callback_data: 'grouplink'
            },
            {
              text: 'Goto Drive',
              callback_data: 'drivelink'
            }
          ],
          [
            {
              text: 'Back',
              callback_data: 'group'
            }
          ]
        ]
      },
      parse_mode: 'markdown',
      message_id: msg.message_id,
    };
    let text;

    if (action === 'group') {
      text = '*Get the Join Link by Clicking the Button Below*';
    }

    bot.editMessage(callbackQuery.chat.id, text, opts);
  });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  bot.on('callback_query', async callbackQuery => {
    const action = callbackQuery.data;
    let text;

    if (action === 'grouplink') {
      bot.sendMessage(chatId, 'https://groups.google.com/g/cloudtorrenter');
    }
  });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  bot.on('callback_query', async callbackQuery => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Back',
              callback_data: 'help'
            }
          ]
        ],
      },
    };
    let text;

    if (action === 'drivelink') {
      bot.sendMessage(callbackQuery.chat.id, 'https://drive.google.com/drive/folders/0AMTkervhUwARUk9PVA', opts);
    }
  });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  bot.on('callback_query', async callbackQuery => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Back',
              callback_data: 'help'
            }
          ]
        ],
      },
      disable_web_page_preview: 'true',
    };
    let text;

    if (action === 'advancedhelp') {
      bot.sendMessage(callbackQuery.chat.id, 'https://telegra.ph/Advanced-Help-for-Cloud-Torrenter-07-31', opts);
    }
  });
//
//
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
    } 
    catch (e) {
      bot.sendMessage(chatId, e.message || "An error occured");
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

    bot.sendMessage(from, "SearchinG ⏳...");

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
      mess1 += `DownloadinG ⛕ :〘${torr.progress}%〙\n\n ${torr.name}\n\n`;

      mess1 += `Total Size : ${torr.total}\n`;
      if (!torr.done) {
        mess1 += `Downloaded : ${torr.downloaded}\n`;
        mess1 += `Download Speed : ${torr.speed}\n\n`;

        mess1 += `Time Left : ${torr.redableTimeRemaining}\n\n`;
        mess1 += `Please /donate any Amount you Wish to keep this Service Alive!\n\n`;
      } else {
        mess1 += `Link: ${torr.downloadLink}\n\n`;
        clearInterval(torrInterv);
        torrInterv = null;
      }

      try {
        if (messageObj) {
          if (messageObj.text !== mess1) bot.editMessageText(mess1, { chat_id: messageObj.chat.id, message_id: messageObj.message_id });
        } else messageObj = await bot.sendMessage(from, mess1);
      } catch (e) {
        console.log(e.message);
      }
    };

    const onDriveUpload = (torr, url) => bot.sendMessage(from, `${torr.name} Uploaded to Gdrive\n${url}`);
    const onDriveUploadStart = torr => bot.sendMessage(from, `Uploading ${torr.name} to Gdrive`);

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
        bot.sendMessage(from, "An Error occured\n" + e.message);
      }
    }
  });

  bot.onText(statusRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    const torr = torrent.get(link);
    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Link is not a Magnet link");
    } else if (!torr) {
      bot.sendMessage(from, "Not downloading please add");
    } else {
      let mess1 = "";
      mess1 += `${torr.status}..\n\n ${torr.name}\n\n`;

      mess1 += `Size 👁‍🗨: ${torr.total}\n\n`;
      if (!torr.done) {
        mess1 += `Downloaded : ${torr.downloaded}\n\n`;
        mess1 += `Speed : ${torr.speed}\n\n`;
        mess1 += `Percentage : ${torr.progress}%\n\n`;
        mess1 += `Time Remaining : ${torr.redableTimeRemaining}\n\n`;
      } else {
        mess1 += `Link: ${torr.downloadLink}\n\n`;
      }

      bot.sendMessage(from, mess1);
    }
  });

  bot.onText(removeRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    try {
      torrent.remove(link);
      bot.sendMessage(from, "Torrent Removed Successfully");
    } catch (e) {
      bot.sendMessage(from, `${e.message}`);
    }
  });
}

module.exports = bot;
