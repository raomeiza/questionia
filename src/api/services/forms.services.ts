import Forms from '../models/forms.model'
import { signToken } from '../utils/tokenizer'
import  IFormService, {IGet, ICreate, IDelete, IGetAll, IUpdate } from '../interfaces/forms.interface'
import { Model, Mongoose } from 'mongoose'

export class FormService implements IFormService {
  constructor() {
    this.model = Forms
  }
  model: typeof Forms
  async create(resource: ICreate): Promise<any> {
    try {      
      const form = await this.model.create(resource)
      return await form;
    } catch (err: any) {
      console.log(err)
      throw ({ message: err.message || 'Form not created', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

  async Update(resource: IUpdate): Promise<any> {
    try {      
      const form = await this.model.findByIdAndUpdate(resource.formId, resource)
      //@ts-ignore
      return await getResponse(form);
    } catch (err: any) {
      throw ({ message: err.message || 'Form not update', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

  async get(resource: IGet): Promise<any> {
    console.log(resource)
    try {      
      const form = await this.model.findById(resource.formId)
      if (form) {
        return form;
      } else {
        throw({message: 'form not found', status: 404})
      }
    } catch (err: any) {
      throw ({ message: err.message || 'Form not found', error: err, status: err.status || err.errorStatus || 404 })
    }
  }
  
  async delete(resource: IGet): Promise<any> {
    try {      
      const form = await this.model.findByIdAndDelete(resource.formId);
      //@ts-ignore
      return await getResponse(form);
    } catch (err: any) {
      throw ({ message: err.message || 'Failed to delete', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

  async getAll(): Promise<any> {
    try {      
      const form = await this.model.find();
      //@ts-ignore
      return await getResponse(form);
    } catch (err: any) {
      throw ({ message: err.message || 'Failed to fetch forms', error: err, status: err.status || err.errorStatus || 404 })
    }
  }

};

async function getResponse(user: { toObject: () => any }, isLogin?: boolean) {
  const userObj = user.toObject();
  userObj.userId = userObj._id
  delete userObj.mobileToken;
  delete userObj.emailToken;
  delete userObj.password;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpiry;
  delete userObj.__v;
  delete userObj._id

  // if the user is logging in, create a token using tokenizer.generateToken and using this.model.userId and unit as argument
  return {
    user: userObj,
  };
}

const generateJWT = (user: { userId: string, email: string, is_admin: Boolean }) => {
  return signToken(user);
};


const customResponse = async  (userObj:any)=> {
  delete userObj.password;
  delete userObj.mobileToken;
  delete userObj.emailToken;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpiry;
  delete userObj.__v;
  return userObj;
}

async function generateToken() {
  return (Math.floor(Math.random() * 9000) + 1000);
}
export default new FormService();