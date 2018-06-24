const TelegramBot = require('node-telegram-bot-api');
var mumble = require('mumble');

var config = require('./config');

var chatId = "";
const bot = new TelegramBot(config.telegramToken, {polling: true});
bot.onText(/\/start/, (msg, match) => {
  console.log("chatId");
  console.log(chatId);
  if(chatId) {
    // bot.sendMessage(chatId, "[warning] Some other is trying to connect to the bot from another group/chat");
    // var msg = "For security reasons, only 1 instance of bot is allowed, if you want to connect to this bot, restart the bot from the server.";
    // bot.sendMessage(msg.chat.id, msg);
  } else {
    chatId = msg.chat.id;
    console.log("chatId", chatId);
    var msg = `
      Wellcome to mumble-telegram-bot. Available commands:
      /start
      /bambi
      /pot
    `;
    bot.sendMessage(chatId, msg);
  }
});
bot.onText(/\/bambi/, (msg, match) => {
  if(chatId) {
    bot.sendMessage(chatId, "This is not bambi 🦌");
  }
});
bot.onText(/\/pot/, (msg, match) => {
  if(chatId) {
    bot.sendMessage(chatId, "💰");
  }
});

var options = {};
console.log( 'Connecting' );
mumble.connect(config.mumbleURL, options, function ( error, connection ) {
    if( error ) { throw new Error( error ); }
    console.log( 'Connected' );

    connection.authenticate( 'TelegramBot' );
    connection.on( 'initialized', function() {
      console.log( 'Connection initialized' );
    });

    connection.on( 'user-connect', function( user ) {
      var msg = '[mumble] ✋️😊 User ' + user.name + ' connected at ' + user.channel.name + ' channel.\nThis is not Bambi 🦌';
      console.log(msg);
      if(chatId) {
        bot.sendMessage(chatId, msg);
      }
    });
    connection.on( 'user-move', function( user ) {
      var msg = '[mumble] 👋 User ' + user.name + ' moved to ' + user.channel.name + ' channel.';
      console.log(msg);
      if(chatId) {
        bot.sendMessage(chatId, msg);
      }
    });
    connection.on( 'user-disconnect', function( user ) {
      var msg = '[mumble] 😢 User ' + user.name + ' has disconnected.';
      console.log(msg);
      if(chatId) {
        bot.sendMessage(chatId, msg);
      }
    });
});
