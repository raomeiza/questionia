import paystack from 'paystack';
import { Router } from 'express';
const dotenv = require('dotenv').config();

const router = Router();

let secretKey = process.env.PAYSTACK_SECRET_KEY;
if (!secretKey) {
  throw new Error('PAYSTACK_SECRET_KEY is not defined');
}
const paystackInstance = paystack(secretKey);

router.post('/charge', async (req, res) => {
  try {
    const { amount, email, reference } = req.body;
    const response = await paystackInstance.transaction.charge({
      amount,
      email,
      reference,
      authorization_code: req.body.authorization_code,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

let chargePaload = {
  amount: 10000,
  email: 'blesseth.omeiza@gmail.com',
  reference: '7PVGX8MEk85tgeEpVDtD',
};

// router.post('/charge/submit_pin', async (req, res) => {
//   try {
//     const response = await paystackInstance.transaction.charge({
//       ...chargePaload,
//       pin: req.body.pin,
//     });
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

router.post('/initialize', async (req, res) => {
  try {
    const { amount, email, reference } = req.body;
    const response = await paystackInstance.transaction.initialize({
      amount,
      email,
      reference,
      name: req.body.name,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { reference } = req.body;
    const response = await paystackInstance.transaction.verify(reference);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;