const TOKEN = '' // bot token
const SECRET = '114514' // 随机字母数字，脸滚键盘即可，一定要随机，和别人重复会出问题
//const SOURCE = 'https://fangliding.github.io/Subtitle-bot/rabbit.txt' // 可选 远程语料库

const WEBHOOK = '/endpoint'

/**
 * 监听器
 */
addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event))
  } else if (url.pathname.toLowerCase() === '/registerwebhook') {
    event.respondWith(registerWebhook(event, url, WEBHOOK, SECRET))
  } else if (url.pathname.toLowerCase() === '/unregisterwebhook') {
    event.respondWith(unRegisterWebhook(event))
  } else {
    event.respondWith(new Response('No handler for this request'+url.pathname))
  }
})

/**
 * 处理 WebHook
 */
async function handleWebhook (event) {
  // Check secret
  if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== SECRET) {
    return new Response('Unauthorized', { status: 403 })
  }

  // Read request body synchronously
  const update = await event.request.json()
  // Deal with response asynchronously
  event.waitUntil(onUpdate(update))

  return new Response('Ok')
}

/**
 * 处理机器人接收到的指令
 * https://core.telegram.org/bots/api#update
 */
async function onUpdate (update) {
  if ('message' in update) {
    await onMessage(update.message)
  }
  if ('inline_query' in update) { // Add this line to handle inline queries
    await onInlineQuery(update.inline_query)
  }
}

/**
 * 处理 inline query
 */
async function onInlineQuery(inlineQuery) {
  if (typeof SOURCE !== 'undefined') {
    const response = await fetch(SOURCE);
    lines = await response.text();
  }
  var results = [];
  var linesArray = lines.trim().split('\n').filter(line => line.trim() !== '');
  
  // 根据用户的查询字符串决定是随机抽取还是搜索
  var query = inlineQuery.query.trim();

  if (query) {
    // 进行搜索
    var matchedLines = linesArray.filter(line => line.includes(query)).slice(0, 50);
    matchedLines.forEach(line => {
      var match = line.match(/{(.+?)}/);
      var description = match ? match[1] : 'No description';
      var content = line.replace(/{(.+?)}/, '').trim();

      results.push({
        type: 'article',
        id: generateUUID(),
        title: content,
        description: description,
        input_message_content: {
          message_text: content
        }
      });
    });
  } else {
    // 随机抽取10行
    var selectedLines = linesArray.sort(() => 0.5 - Math.random()).slice(0, 10);
    selectedLines.forEach(line => {
      var match = line.match(/{(.+?)}/);
      var description = match ? match[1] : 'No description';
      var content = line.replace(/{(.+?)}/, '').trim();

      results.push({
        type: 'article',
        id: generateUUID(),
        title: content,
        description: description,
        input_message_content: {
          message_text: content
        }
      });
    });
  }

  const data = {
    inline_query_id: inlineQuery.id,
    results: JSON.stringify(results),
    cache_time: 1 // Set cache time to 1 second
  };

  return fetch(apiUrl('answerInlineQuery', data)).then(response => response.json());
}

//生成一个UUID 因为id需要一个随机值
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

/**
 * 设置 webhook
 * https://core.telegram.org/bots/api#setwebhook
 */
async function registerWebhook (event, requestUrl, suffix, secret) {
  // https://core.telegram.org/bots/api#setwebhook
  const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`
  const r = await (await fetch(apiUrl('setWebhook', { url: webhookUrl, secret_token: secret }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}

/**
 * 注销 webhook
 * https://core.telegram.org/bots/api#setwebhook
 */
async function unRegisterWebhook (event) {
  const r = await (await fetch(apiUrl('setWebhook', { url: '' }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}

/**
 * 回复 telegram api
 */
function apiUrl (methodName, params = null) {
  let query = ''
  if (params) {
    query = '?' + new URLSearchParams(params).toString()
  }
  return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`
}

/**
 * 发送文本回复
 * https://core.telegram.org/bots/api#sendmessage
 */
async function sendPlainText (chatId, text) {
  return (await fetch(apiUrl('sendMessage', {
    chat_id: chatId,
    text
  }))).json()
}

/**
 * 处理 /start
 * https://core.telegram.org/bots/api#message
 */
function onMessage (message) {
  if (message.text.startsWith('/start') || message.text.startsWith('/help')) {
    return sendPlainText(message.chat.id, 'Powerby ACCEED Technology.\nSource: https://github.com/Fangliding/Subtitle-bot\nAuthor: @Fangliding')}
}

/**
 * bot调用到的数据(如果选择写在workers而不是远程txt文件)
 * 格式(一行一个): {S1E1}智乃酱~
 * 你可以自己想办法从ass字幕文件之类的地方生成出来
 */
var lines = `

`;
