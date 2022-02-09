const TelegramApi = require('node-telegram-bot-api')

const {TOKEN} = require('./env.js')
const {gameOptions, againOptions} = require('./options')

console.log(TOKEN)


const bot =  new TelegramApi(TOKEN, {polling: true});

const chats = {}

const startGame = async (chatId) =>{
  await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен её угодать!');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {

  bot.setMyCommands([
    {command: '/start', description: 'Началоное приветсвие'},
    {command: '/info', description: 'Получить информацию о пользовтели'},
    {command: '/games', description: 'Игра угадай цифру'},
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if(text === '/start'){
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/860/45c/86045c58-3ba6-34dd-9974-06e4d942b5d0/1.webp')
      return bot.sendMessage(chatId, `Добро пожаловать в телеграм Traumerei`);
    }
    if(text === '/info'){
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
    }
    if(text === '/games'){
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимю! Попробуй ещё раз!');

  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if(data === '/again'){
      return startGame(chatId)
    }
    if(data == chats[chatId]){
      return bot.sendMessage(chatId, `Поздравляю, ты отгодал цифру ${chats[chatId]}`, againOptions);
    }else{
      return bot.sendMessage(chatId, `К сожелению ты не угодал, бот загадал цифру ${chats[chatId]}`, againOptions);
    }
  })
}

start()