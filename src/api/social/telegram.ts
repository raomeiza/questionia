                                                                                                                                                                                                import telegram from "node-telegram-bot-api";
import formBridge from "./form-bridge";
import { ResponseModel } from "../models/forms.model";
let secretKey = process.env.TELEGRAM_BOT_TOKEN;

if (!secretKey) {
  throw new Error("TELEGRAM_SECRET_KEY is not defined");
}
//create a map for storing chat sessions
const chat = new Map();

export const telegramInstance = new telegram(secretKey, { polling: true });
// telegramInstance.setWebHook("https://telegram-bot-omeiza.herokuapp.com/webhook");

// telegramInstance.on('inline_query', async (ctx) => {
//   console.log('inline_query', ctx)
//   const { query } = ctx
//   // const results = await form.get({formId: query})
//   telegramInstance.sendMessage(ctx.from.id, JSON.stringify(results))
// })

telegramInstance.on("chosen_inline_result", async (ctx) => {
  const { result_id } = ctx;
  let message =
    result_id === "1"
      ? "You have started filling a form"
      : "You have cancelled filling a form";
  // const results = await form.get({formId: result_id})
  telegramInstance.sendMessage(ctx.from.id, message);
});

const handleResponse = async (ctx: any, type: string) => {
  const chatId = type === "message" ? ctx.chat?.id : ctx.from?.id;
  const userId = type === "message" ? ctx.from?.id : ctx.message.chat?.id;
  try {
    // if this is a confirmation message, then check if the user confirmed or not
    // and set the input as confirmed else send the user the input again
    if (type !== "message") {
      const { data } = ctx;
      const [confFormId, action, confIinputId] = data.split("__");
      const messageId = ctx.message?.message_id;
      //remove the inline keyboard or reply keyboard
      telegramInstance.editMessageReplyMarkup(
        { inline_keyboard: [] },
        { chat_id: chatId, message_id: messageId }
      );
      if (action === "confirm") {
        const _chatSession = chat.get(chatId);
        if (!_chatSession) {
          telegramInstance.sendMessage(userId, "You are not filling a form 1");
          return;
        }
        // check if the user is filling a form
        if (!_chatSession.formId || !_chatSession.inputId) {
          telegramInstance.sendMessage(userId, "You are not filling a form 2");
          return;
        }
        // check if there is a next input
        if (!_chatSession.nextInput) {
          finalizeForm(_chatSession.replies, _chatSession.formId, userId);
          return;
        }
        const _input = await formBridge.telegram(
          _chatSession.formId,
          _chatSession.nextInput
        );
        if (!_input) {
          telegramInstance.sendMessage(userId, "This form has no inputs");
          return;
        }
        if (!_input.telegram) {
          let nextInputId = _input.nextInput;
          if (nextInputId) {
            const nextInput = await formBridge.telegram(
              _chatSession.formId,
              nextInputId
            );
            if (!nextInput) {
              finalizeForm(_chatSession.replies, _chatSession.formId, userId);
              return;
            }
            // send the user the next input
            telegramInstance
            //@ts-ignore
              .sendMessage(userId, ...nextInput.telegram)
              .then((res) => {
                let messageId = res.message_id;
                const session = chat.get(chatId);
                const { formId, inputId, replies, prevMessageId } = session;
                replies.set(messageId, {
                  inputName: nextInput.name,
                  question: nextInput.label,
                  confirmed: nextInput.telegram_need_confirmation,
                  ...(nextInput.telegram_button_options
                    ? {
                        telegram_button_options:
                          nextInput.telegram_button_options,
                      }
                    : {}),
                  answer: "",
                });
                chat.set(chatId, {
                  formId,
                  inputId: nextInput._id,
                  nextInput: nextInput.nextInput,
                  replies,
                  prevMessageId: messageId,
                  inputIds: [...session.inputIds, nextInput._id],
                });
              });
          }
        }
        // send the user the next input
        //@ts-ignore
        telegramInstance.sendMessage(userId, ..._input.telegram).then((res) => {
          let messageId = res.message_id;
          const session = chat.get(chatId);
          const { formId, inputId, replies, prevMessageId } = session;
          replies.set(messageId, {
            inputName: _input.name,
            question: _input.label,
            confirmed: _input.telegram_need_confirmation,
            answer: "",
          });
          chat.set(chatId, {
            formId,
            inputId: _input._id,
            nextInput: _input.nextInput,
            replies,
            prevMessageId: messageId,
            inputIds: [...session.inputIds, _input._id],
          });
        });
        return;
      } else if (action === "edit" && !confIinputId) {
        // for editing the whole form
        // iterate throough the replies and make a button for each reply
        //with which the user can trigger the edit action
        const session = chat.get(chatId);
        const { replies, inputIds } = session;
        const buttons = [...replies.values()].map((reply, index) => {
          return [
            {
              text: reply.question,
              callback_data: `${confFormId}__edit__${inputIds[index]}`,
            },
          ];
        });
        // add a button for continuing without editing any input
        buttons.push([
          {
            text: "Continue, I don't want to edit any input",
            callback_data: `${confFormId}__continue`,
          },
        ]);
        telegramInstance.sendMessage(
          userId,
          "Which input do you want to edit?",
          {
            reply_markup: {
              inline_keyboard: buttons,
            },
          }
        );
        return;
      } else if (action === "edit") {
        // for editing an input
        const _chatSession = chat.get(chatId);
        if (!_chatSession) {
          telegramInstance.sendMessage(userId, "You are not filling a form");
          return;
        }
        // check if the user is filling a form
        if (!_chatSession.formId || !_chatSession.inputId) {
          telegramInstance.sendMessage(userId, "You are not filling a form");
          return;
        }

        // get the previous input
        const _input = await formBridge.telegram(
          _chatSession.formId,
          confIinputId
        );
        if (!_input) {
          telegramInstance.sendMessage(userId, "This form has no inputs");
          return;
        }
        // send the user the first input
        //@ts-ignore
        telegramInstance.sendMessage(userId, ..._input.telegram);
        return;
      } else if (action === "submit") {
        saveForm(chat.get(chatId).replies, confFormId, userId);
        return;
      } else if (action === "cancel") {
        // send a confirmation message to the user
        const buttons = [
          { text: "Yes", callback_data: `${confFormId}__cancel.confirm` },
          { text: "No", callback_data: `${confFormId}__cancel.cancel` },
        ].map((button) => {
          return [button];
        });
        telegramInstance.sendMessage(
          userId,
          "Are you sure you want to cancel filling this form?",
          {
            reply_markup: {
              inline_keyboard: buttons,
            },
          }
        );
        return;
      } else if (action === "cancel.confirm") {
        chat.delete(chatId);
        telegramInstance.sendMessage(
          userId,
          "You have cancelled filling this form"
        );
        return;
      } else if (action === "continue") {
        finalizeForm(chat.get(chatId).replies, confFormId, userId);
        return;
      }
      // for cancel.cancel, do nothing. allow the flow to continue
    }

    const chatSession = chat.get(chatId);
    if (!chatSession) {
      const formId = ctx.data;
      if (formId) {
        // get it from the form bridge
        const input = await formBridge.telegram(formId, "0");
        if (!input) {
          telegramInstance.sendMessage(userId, "This form has no inputs");
          return;
        }
        // send the user the first input
        //@ts-ignore
        telegramInstance.sendMessage(userId, ...input.telegram).then((res) => {
          let messageId = res.message_id;
          const replies = new Map().set(messageId, {
            inputName: input.name,
            question: input.label,
            confirmed: input.telegram_need_confirmation,
            ...(input.telegram_button_options
              ? { telegram_button_options: input.telegram_button_options }
              : {}),
            answer: "",
          });
          chat.set(chatId, {
            formId,
            inputId: "0",
            nextInput: input.nextInput,
            replies,
            prevMessageId: messageId,
            inputIds: ["0"],
          });
        });
      }
      //  else {
      //   telegramInstance.sendMessage(userId, "You are not filling a form");
      // }
      return;
    }
    const { formId, inputId, nextInput, replies, prevMessageId } = chatSession;
    const prevMessage = replies.get(prevMessageId);
    const { question } = prevMessage;

    // if the input is not confirmed, send the user a query asking if the input is correct or not
    if (type === "message") {
      if (!prevMessage.telegram_button_options) {
        let response = ctx.text;
        if (!response) {
          telegramInstance.sendMessage(
            userId,
            "Please provide a valid response"
          );
          return;
        }
        const { formId, inputId, replies, prevMessageId } = chatSession;
        const thisReply = replies.get(prevMessageId);
        replies.set(prevMessageId, { ...thisReply, answer: response });
        chat.set(chatId, {
          ...chatSession,
          ...(chatSession.completed ? { nextInput: null } : {}),
          replies,
        });
        const buttons = [
          { text: "Yes", callback_data: `${formId}__confirm__${inputId}` },
          { text: "No, Edit it", callback_data: `${formId}__edit__${inputId}` },
        ].map((button) => {
          return [button];
        });
        telegramInstance.sendMessage(
          userId,
          formBridge.escapeMarkdown(
            `Question: *${question}* \n\nYour answer: *${response}* \n\nIs this correct?`
          ),
          {
            parse_mode: "MarkdownV2",
            reply_markup: {
              inline_keyboard: buttons,
            },
          }
        );
        return;
      } else {
        if (!prevMessage.telegram_button_options.includes(ctx.text)) {
          telegramInstance.sendMessage(
            userId,
            "Please only select from the options provided"
          );
          return;
        }
      }
    }
    // check if the user is filling a form
    if (!formId || !inputId) {
      ctx.from &&
        telegramInstance.sendMessage(userId, "You are not filling a form");
      return;
    }
    // check if the user is filling the right form
    if (formId !== chatSession.formId) {
      ctx.from &&
        telegramInstance.sendMessage(userId, "You are not filling this form");
      return;
    }
    // check if the user is filling the right input
    if (inputId !== chatSession.inputId) {
      ctx.from &&
        telegramInstance.sendMessage(userId, "You are not filling this input");
      return;
    }
    //if next input is null, then the form is complete
    if (!nextInput) {
      // get all the replies
      const replies = chatSession.replies;
      // finalize the form
      finalizeForm(replies, formId, userId);
      return;
    }
    // get the next input
    const input = await formBridge.telegram(formId, nextInput);
    if (!input) {
      ctx.from &&
        telegramInstance.sendMessage(userId, "This form has no inputs");
      return;
    }
    const response = type === "message" ? ctx.message?.text : ctx.data;
    const reply = replies.get(prevMessageId);
    replies.set(prevMessageId, { ...reply, answer: response });
    // send the user the first input
    //@ts-ignore
    telegramInstance.sendMessage(userId, ...input.telegram).then((res) => {
      let messageId = res.message_id;
      replies.set(messageId, {
        inputName: input.name,
        question: input.label,
        confirmed: input.telegram_need_confirmation,
        ...(input.telegram_button_options
          ? { telegram_button_options: input.telegram_button_options }
          : {}),
        answer: "",
      });
      chat.set(chatId, {
        formId,
        inputId: nextInput,
        nextInput: input.nextInput,
        replies,
        prevMessageId: messageId,
        inputIds: [...chatSession.inputIds, input._id],
      });
    });
  } catch (error) {
    telegramInstance.sendMessage(
      userId,
      "An error occured while processing your response. Please try again or contact the form owner"
    );
  }
};

telegramInstance.on("callback_query", async (ctx) => {
  handleResponse(ctx, "callback_query");
});

// on a reply message, check if the user is filling a form
telegramInstance.on("message", async (ctx) => {
  const { text } = ctx;
  // if (text?.startsWith('/start') && !chat.get(ctx.chat?.id)) {
  //   let formId = text.split('t/')[1]
  //   //check if id is a valid mongo id
  //   if(!formId || formId.length !== 24 || !formId.match(/^[0-9a-fA-F]{24}$/)) {
  //     //@ts-ignore
  //     telegramInstance.sendMessage(ctx?.from?.id, 'Please provide a valid form id./n/nThe command should be in this format: /start/5f9b3b3b3b3b3b3b3b3b3b3b')
  //     return
  //   }
  //   // send an inline keyboard asking if the user really wants to start fillling
  //   // the form
  //   // const results = await form.get({formId: '1'})
  //   const buttons = [{text: 'Yes', callback_data: formId}, {text: 'No', callback_data: '0'}].map((button) => {
  //     return [button]
  //   })
  //   telegramInstance.sendMessage(ctx?.from?.id || 6554560778, `Do you want to start filling this form with id ${formId}?`, {
  //     reply_markup: {
  //       inline_keyboard: buttons
  //     }
  //   })
  //   return
  // }else
  if (text?.startsWith("/cancel")) {
    let formId = text.split("l/")[1];
    //check if id is a valid mongo id
    if (!formId || formId.length !== 24 || !formId.match(/^[0-9a-fA-F]{24}$/)) {
      telegramInstance.sendMessage(
        //@ts-ignore
        ctx?.from?.id,
        "Please provide a valid form id./n/nThe command should be in this format: /cancel/5f9b3b3b3b3b3b3b3b3b3b3b",
        { parse_mode: "MarkdownV2"}
      );
      return;
    }
    // send an inline keyboard asking if the user really wants to start fillling
    // the form
    // const results = await form.get({formId: '1'})
    const buttons = [
      { text: "Yes", callback_data: formId },
      { text: "No", callback_data: "0" },
    ].map((button) => {
      return [button];
    });
    telegramInstance.sendMessage(
      ctx?.from?.id || 6554560778,
      `Do you want to cancel filling this form with id *${formId}*?`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: buttons,
        },
      }
    );
    return;
  } else {
    handleResponse(ctx, "message");
  }
});

// on command /start, check if the user is filling a form
telegramInstance.onText(/\/start/, async (ctx) => {
  const { text } = ctx;
  if (text?.startsWith("/start") && !chat.get(ctx.chat?.id)) {
    let formId = text.split("t ")[1];
    //check if id is a valid mongo id
    if (!formId || formId.length !== 24 || !formId.match(/^[0-9a-fA-F]{24}$/)) {
      telegramInstance.sendMessage(
        //@ts-ignore
        ctx?.from?.id,
        "Please provide a valid form id./n/nThe command should be in this format: /start/5f9b3b3b3b3b3b3b3b3b3b3b",
        { parse_mode: "MarkdownV2"}
      );
      return;
    }
    // send an inline keyboard asking if the user really wants to start fillling
    // the form
    // const results = await form.get({formId: '1'})
    const buttons = [
      { text: "Yes", callback_data: formId },
      { text: "No", callback_data: "0" },
    ].map((button) => {
      return [button];
    });
    telegramInstance.sendMessage(
      ctx?.from?.id || 6554560778,
      `Do you want to start filling this form with id *${formId}*?`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: buttons,
        },
      }
    );
    return;
  } else if (text?.startsWith("/cancel")) {
    let formId = text.split("l/")[1];
    //check if id is a valid mongo id
    if (!formId || formId.length !== 24 || !formId.match(/^[0-9a-fA-F]{24}$/)) {
      telegramInstance.sendMessage(
        //@ts-ignore
        ctx?.from?.id,
        "Please provide a valid form id./n/nThe command should be in this format: /cancel/5f9b3b3b3b3b3b3b3b3b3b3b"
      );
      return;
    }
    // send an inline keyboard asking if the user really wants to start fillling
    // the form
    // const results = await form.get({formId: '1'})
    const buttons = [
      { text: "Yes", callback_data: formId },
      { text: "No", callback_data: "0" },
    ].map((button) => {
      return [button];
    });
    telegramInstance.sendMessage(
      ctx?.from?.id || 6554560778,
      `Do you want to cancel filling this form with id *${formId}*?`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: buttons,
        },
      }
    );
    return;
  }
});

const finalizeForm = async (replies: any, formId: String, userId: string) => {
  try {
  let session = chat.get(userId);
  session.completed = true; // set the session as completed. this does not mean the form is saved
  // but is necessary to keep track in case the user decides to correct any of the inputs
  // so that we don't go in a loop
  chat.set(userId, session);
  let message = "Please confirm your answers below:";
  for (const [key, value] of replies.entries()) {
    message += formBridge.escapeMarkdown(
      `\n\n${value.question}\n*${value.answer}*`
    );
  }
  // create an inline keyboard for submiting, editing or cancelling the form
  const buttons = [
    { text: "Submit", callback_data: `${formId}__submit` },
    { text: "Edit", callback_data: `${formId}__edit` },
    { text: "Cancel", callback_data: `${formId}__cancel` },
  ].map((button) => {
    return [button];
  });
  telegramInstance.sendMessage(userId, message, {
    parse_mode: "MarkdownV2",
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
  } catch (error) {
    telegramInstance.sendMessage(
      userId,
      "An error occured while finalizing your response. Please try again"
    );
  }
};

const saveForm = async (replies: any, formId: String, userId: string) => {
  let data = {};
  for (const [key, value] of replies.entries()) {
    // @ts-ignore
    data[value.inputName] = value.answer;
  }
  const saved = await ResponseModel.create({
    formId,
    data: { ...data, },
    channel: "telegram",
  });
  if (!saved) {
    telegramInstance.sendMessage(
      userId,
      "An error occured while saving your response. Please try again"
    );
    return;
  }
  telegramInstance.sendMessage(
    userId,
    "Thank you for your time. Your response has been saved."
  );
  chat.delete(userId);
};

let telegramHookUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook?url=https://www.questionia.com.ng/webhook/telegram`
export default telegramInstance;
