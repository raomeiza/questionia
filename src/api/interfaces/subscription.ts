import mongoose, { Types } from "mongoose";

export interface ISubscription {
  userId: string;
  subscriptionId: string;
}

export interface ICard {
  userId: string;
  cardId: string;
  cardNumber: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface IVerifyCard {
  userId: string;
  cardId: string;
  otp: string;
}

export interface IDeleteCard {
  userId: string;
  cardId: string;
}

export interface IDeleteSubscription {
  userId: string;
  subscriptionId: string;
}

export interface IGetSubscription {
  userId: string;
  subscriptionId: string;
}

export interface IGetCard {
  userId: string;
  cardId: string;
}

export interface IGetAllSubscriptions {
  userId: string;
}

export interface IGetAllCards {
  userId: string;
}

export interface IPaymentService {
  createSubscription(resource: ISubscription): Promise<any>;
  createCard(resource: ICard): Promise<any>;
  verifyCard(resource: IVerifyCard): Promise<any>;
  deleteCard(resource: IDeleteCard): Promise<any>;
  deleteSubscription(resource: IDeleteSubscription): Promise<any>;
  getSubscription(resource: IGetSubscription): Promise<any>;
  getCard(resource: IGetCard): Promise<any>;
  getAllSubscriptions(resource: IGetAllSubscriptions): Promise<any>;
  getAllCards(resource: IGetAllCards): Promise<any>;
}

export interface ICreateSubscription {
  userId: string;
  subscriptionId: string;
  cardId: string;
}
