import { Router } from "express";
import  telegramInstance  from '../social'

const router = Router();
// telegramInstance.on("message", (msg: { chat: { id: any; }; }) => {
//   const chatId = msg.chat.id;
//   telegramInstance.sendMessage(chatId, "Received your message");
// });

telegramInstance.on("polling_error", (error: any) => {
  console.log(error);
});

telegramInstance.on("webhook_error", (error: any) => {
  console.log(error);
});


// webhook
router.post("/", async (req, res) => {
  console.log(req.body)
  try {
    const { message } = req.body;
    const response = await telegramInstance.sendMessage(
      message.chat.id,
      "Hello World"
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/", async (req, res) => {
  console.log(req.body)
  try {
    const { message } = req.body;
    const response = await telegramInstance.sendMessage(
      message.chat.id,
      "Hello World"
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// getMe
router.get("/getMe", async (req, res) => {
  try {
    const response = await telegramInstance.getMe();
    res.status(200).json(response);
  } catch (error) {

    res.status(500).json(error);

  }
});

// sendMessage
router.post("/sendMessage", async (req, res) => {
  try {
    const { chat_id, text } = req.body;
    const response = await telegramInstance.sendMessage(chat_id, text);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendPhoto
router.post("/sendPhoto", async (req, res) => {
  try {
    const { chat_id, photo } = req.body;
    const response = await telegramInstance.sendPhoto(chat_id, photo);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendAudio
router.post("/sendAudio", async (req, res) => {
  try {
    const { chat_id, audio } = req.body;
    const response = await telegramInstance.sendAudio(chat_id, audio);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendDocument
router.post("/sendDocument", async (req, res) => {
  try {
    const { chat_id, document } = req.body;
    const response = await telegramInstance.sendDocument(chat_id, document);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendVideo
router.post("/sendVideo", async (req, res) => {
  try {
    const { chat_id, video } = req.body;
    const response = await telegramInstance.sendVideo(chat_id, video);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendAnimation
router.post("/sendAnimation", async (req, res) => {
  try {
    const { chat_id, animation } = req.body;
    const response = await telegramInstance.sendAnimation(chat_id, animation);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendVoice
router.post("/sendVoice", async (req, res) => {
  try {
    const { chat_id, voice } = req.body;
    const response = await telegramInstance.sendVoice(chat_id, voice);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendVideoNote
router.post("/sendVideoNote", async (req, res) => {
  try {
    const { chat_id, video_note } = req.body;
    const response = await telegramInstance.sendVideoNote(chat_id, video_note);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendMediaGroup
router.post("/sendMediaGroup", async (req, res) => {
  try {
    const { chat_id, media } = req.body;
    const response = await telegramInstance.sendMediaGroup(chat_id, media);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendLocation
router.post("/sendLocation", async (req, res) => {
  try {
    const { chat_id, latitude, longitude } = req.body;
    const response = await telegramInstance.sendLocation(
      chat_id,
      latitude,
      longitude
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// editMessageLiveLocation
router.post("/editMessageLiveLocation", async (req, res) => {
  try {
    const { chat_id, latitude, longitude } = req.body;
    const response = await telegramInstance.editMessageLiveLocation(
      chat_id,
      latitude,
      longitude
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// stopMessageLiveLocation
router.post("/stopMessageLiveLocation", async (req, res) => {
  try {
    const { chat_id } = req.body;
    const response = await telegramInstance.stopMessageLiveLocation(chat_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendVenue
router.post("/sendVenue", async (req, res) => {
  try {
    const { chat_id, latitude, longitude, title, address } = req.body;
    const response = await telegramInstance.sendVenue(
      chat_id,
      latitude,
      longitude,
      title,
      address
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendContact
router.post("/sendContact", async (req, res) => {
  try {
    const { chat_id, phone_number, first_name } = req.body;
    const response = await telegramInstance.sendContact(
      chat_id,
      phone_number,
      first_name
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendPoll
router.post("/sendPoll", async (req, res) => {
  try {
    const { chat_id, question, options } = req.body;
    const response = await telegramInstance.sendPoll(
      chat_id,
      question,
      options
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendDice
router.post("/sendDice", async (req, res) => {
  try {
    const { chat_id } = req.body;
    const response = await telegramInstance.sendDice(chat_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendChatAction
router.post("/sendChatAction", async (req, res) => {
  try {
    const { chat_id, action } = req.body;
    const response = await telegramInstance.sendChatAction(chat_id, action);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// getUserProfilePhotos
router.post("/getUserProfilePhotos", async (req, res) => {
  try {
    const { user_id } = req.body;
    const response = await telegramInstance.getUserProfilePhotos(user_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// getFile
router.post("/getFile", async (req, res) => {
  try {
    const { file_id } = req.body;
    const response = await telegramInstance.getFile(file_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// banChatMember
router.post("/banChatMember", async (req, res) => {
  try {
    const { chat_id, user_id } = req.body;
    const response = await telegramInstance.banChatMember(chat_id, user_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// unbanChatMember
router.post("/unbanChatMember", async (req, res) => {
  try {
    const { chat_id, user_id } = req.body;
    const response = await telegramInstance.unbanChatMember(chat_id, user_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// restrictChatMember
router.post("/restrictChatMember", async (req, res) => {
  try {
    const { chat_id, user_id } = req.body;
    const response = await telegramInstance.restrictChatMember(
      chat_id,
      user_id
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// promoteChatMember
router.post("/promoteChatMember", async (req, res) => {
  try {
    const { chat_id, user_id } = req.body;
    const response = await telegramInstance.promoteChatMember(chat_id, user_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// setChatAdministratorCustomTitle
router.post("/setChatAdministratorCustomTitle", async (req, res) => {
  try {
    const { chat_id, user_id, custom_title } = req.body;
    const response = await telegramInstance.setChatAdministratorCustomTitle(
      chat_id,
      user_id,
      custom_title
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// setChatPermissions
router.post("/setChatPermissions", async (req, res) => {
  try {
    const { chat_id, permissions } = req.body;
    const response = await telegramInstance.setChatPermissions(
      chat_id,
      permissions
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// exportChatInviteLink
router.post("/exportChatInviteLink", async (req, res) => {
  try {
    const { chat_id } = req.body;
    const response = await telegramInstance.exportChatInviteLink(chat_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// setChatPhoto
router.post("/setChatPhoto", async (req, res) => {
  try {
    const { chat_id, photo } = req.body;
    const response = await telegramInstance.setChatPhoto(chat_id, photo);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// deleteChatPhoto
router.post("/deleteChatPhoto", async (req, res) => {
  try {
    const { chat_id } = req.body;
    const response = await telegramInstance.deleteChatPhoto(chat_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// setChatTitle
router.post("/setChatTitle", async (req, res) => {
  try {
    const { chat_id, title } = req.body;
    const response = await telegramInstance.setChatTitle(chat_id, title);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// setChatDescription
router.post("/setChatDescription", async (req, res) => {
  try {
    const { chat_id, description } = req.body;
    const response = await telegramInstance.setChatDescription(
      chat_id,
      description
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// pinChatMessage
router.post("/pinChatMessage", async (req, res) => {
  try {
    const { chat_id, message_id } = req.body;
    const response = await telegramInstance.pinChatMessage(chat_id, message_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// unpinChatMessage
router.post("/unpinChatMessage", async (req, res) => {
  try {
    const { chat_id } = req.body;
    const response = await telegramInstance.unpinChatMessage(chat_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// send list of commands
router.post("/setMyCommands", async (req, res) => {
  try {
    const { commands } = req.body;
    const response = await telegramInstance.setMyCommands(commands);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get list of commands
router.get("/getMyCommands", async (req, res) => {
  try {
    const response = await telegramInstance.getMyCommands();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete list of commands
// router.post("/deleteMyCommands", async (req, res) => {
//   try {
//     const response = await telegramInstance.deleteMyCommands();
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// editMessageText
router.post("/editMessageText", async (req, res) => {
  try {
    const { chat_id, message_id, text } = req.body;
    const response = await telegramInstance.editMessageText(
      chat_id,
      message_id,
      // text
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// editMessageCaption
router.post("/editMessageCaption", async (req, res) => {
  try {
    const { chat_id, message_id, caption } = req.body;
    const response = await telegramInstance.editMessageCaption(
     caption, {chat_id, message_id,}
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// editMessageMedia
// router.post("/editMessageMedia", async (req, res) => {
//   try {
//     const { chat_id, message_id, media } = req.body;
//     const response = await telegramInstance.editMessageMedia(
//       chat_id,
//       message_id,
//       media
//     );
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// // editMessageReplyMarkup
// router.post("/editMessageReplyMarkup", async (req, res) => {
//   try {
//     const { chat_id, message_id, reply_markup } = req.body;
//     const response = await telegramInstance.editMessageReplyMarkup(
//       chat_id,
//       message_id,
//       reply_markup
//     );
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// stopPoll
router.post("/stopPoll", async (req, res) => {
  try {
    const { chat_id, message_id } = req.body;
    const response = await telegramInstance.stopPoll(chat_id, message_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// deleteMessage
router.post("/deleteMessage", async (req, res) => {
  try {
    const { chat_id, message_id } = req.body;
    const response = await telegramInstance.deleteMessage(chat_id, message_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sendSticker
router.post("/sendSticker", async (req, res) => {
  try {
    const { chat_id, sticker } = req.body;
    const response = await telegramInstance.sendSticker(chat_id, sticker);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// getStickerSet
router.post("/getStickerSet", async (req, res) => {
  try {
    const { name } = req.body;
    const response = await telegramInstance.getStickerSet(name);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// uploadStickerFile
router.post("/uploadStickerFile", async (req, res) => {
  try {
    const { user_id, png_sticker } = req.body;
    const response = await telegramInstance.uploadStickerFile(
      user_id,
      png_sticker
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// // createNewStickerSet
// router.post("/createNewStickerSet", async (req, res) => {
//   try {
//     const { user_id, name, title, png_sticker } = req.body;
//     const response = await telegramInstance.createNewStickerSet(
//       user_id,
//       name,
//       title,
//       png_sticker
//     );
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// addStickerToSet
// router.post("/addStickerToSet", async (req, res) => {
//   try {
//     const { user_id, name, png_sticker } = req.body;
//     const response = await telegramInstance.addStickerToSet(
//       user_id,
//       name,
//       png_sticker
//     );
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// setStickerPositionInSet
router.post("/setStickerPositionInSet", async (req, res) => {
  try {
    const { sticker, position } = req.body;
    const response = await telegramInstance.setStickerPositionInSet(
      sticker,
      position
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// deleteStickerFromSet
router.post("/deleteStickerFromSet", async (req, res) => {
  try {
    const { sticker } = req.body;
    const response = await telegramInstance.deleteStickerFromSet(sticker);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// // send list message
// router.post("/sendInvoice", async (req, res) => {
//   try {
//     const { chat_id, title, description, payload } = req.body;
//     const response = await telegramInstance.sendInvoice(
//       chat_id,
//       title,
//       description,
//       payload
//     );
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// send inline query
router.post("/answerShippingQuery", async (req, res) => {
  try {
    const { shipping_query_id, ok } = req.body;
    const response = await telegramInstance.answerShippingQuery(
      shipping_query_id,
      ok
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;