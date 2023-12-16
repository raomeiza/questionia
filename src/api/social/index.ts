import telegram from "node-telegram-bot-api";
const dotenv = require("dotenv").config();

let secretKey = process.env.TELEGRAM_BOT_TOKEN;

if (!secretKey) {
  throw new Error("TELEGRAM_SECRET_KEY is not defined");
}


export const telegramInstance = new telegram(secretKey, { polling: true });
// telegramInstance.setWebHook("https://telegram-bot-omeiza.herokuapp.com/webhook");

import form from '../services/forms.services'

// telegramInstance.on('inline_query', async (ctx) => {
//   console.log('inline_query', ctx)
//   const { query } = ctx
//   // const results = await form.get({formId: query})
//   telegramInstance.sendMessage(ctx.from.id, JSON.stringify(results))
// })

telegramInstance.on('chosen_inline_result', async (ctx) => {
  console.log('chosen_inline_result', ctx)
  const { result_id } = ctx
  let message = result_id === '1' ? 'You have started filling a form' : 'You have cancelled filling a form'
  // const results = await form.get({formId: result_id})
  telegramInstance.sendMessage(ctx.from.id, message)
})

// telegramInstance.on('callback_query', async (ctx) => {
//   console.log('callback_query', ctx)
//   const { data } = ctx
//   // const results = await form.get({formId: data||'1'})
//   telegramInstance.sendMessage(ctx.from.id, JSON.stringify(results))
// })

telegramInstance.on('message', async (ctx) => {
  console.log('message', ctx)
  const { text } = ctx
  if(text?.startsWith('/start')) {
    let formId = text.split('t/')[1]
    //check if id is a valid mongo id
    if(!formId || formId.length !== 24 || !formId.match(/^[0-9a-fA-F]{24}$/)) {
      //@ts-ignore
      telegramInstance.sendMessage(ctx?.from?.id, 'Please provide a valid form id./n/nThe command should be in this format: /start/5f9b3b3b3b3b3b3b3b3b3b3b')
      return
    }
    // send an inline keyboard asking if the user really wants to start fillling
    // the form
    // const results = await form.get({formId: '1'})
    const buttons = [{text: 'Yes', callback_data: '1'}, {text: 'No', callback_data: '0'}].map((button) => {
      return [button]
    })
    telegramInstance.sendMessage(ctx?.from?.id || 6554560778, `Do you want to start filling this form with id ${formId}?`, {
      reply_markup: {
        inline_keyboard: buttons
      }
    })
  }
})

export default telegramInstance