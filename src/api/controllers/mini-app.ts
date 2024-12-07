// create an express router hander for the mini-app post requests. the end point is /mini-app

import { Request, Response, Router } from 'express';
import {handleResponse} from '../social/telegram';

const miniAppRouter = Router();

miniAppRouter.post('/telegram', async (req: Request, res: Response) => {
  // get formId, inputId, userTgId, message from the request body
  const { formId, inputId, userTgId, text, chatId } = req.body
  // let formulate a telegram message context from the request body and pass it to the handleResponse function
  const ctx = {
    chat: {
      id: Number(chatId), //its important to ensure that the chatId is a number
    },
    from: {
      id: userTgId,
    },
    text,
    data: formId,
  }
  handleResponse(ctx, 'message');
  res.status(200).json({status: 'success', message: 'Message sent successfully'}).end();
})

// for every other request, return a 404 error
miniAppRouter.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    message: 'Not Found',
    status: 404,
  });
});

export default miniAppRouter;