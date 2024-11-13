import Forms, { ResponseModel } from "../models/forms.model";
import { signToken } from "../utils/tokenizer";
import IFormService, {
  IGet,
  ICreate,
  IDelete,
  IGetAll,
  IResponse,
} from "../interfaces/forms.interface";
import { Model, Mongoose } from "mongoose";
import { Types } from 'mongoose';

export class FormService implements IFormService {
  constructor() {
    this.model = Forms;
    this.responseModel = ResponseModel;
  }
  model: typeof Forms;
  responseModel: typeof ResponseModel;
  async create(resource: ICreate): Promise<any> {
    try {
      const form = await this.model.create(resource);
      return form;
    } catch (err: any) {
      throw {
        message: err.message || "Form not created",
        error: err,
        status: err.status || err.errorStatus || 404,
      };
    }
  }

  async Update(
    resource: ICreate,
    formId: string,
    userId: string
  ): Promise<any> {
    try {
      // create a query to update only the fields that are passed in the resource object
      const updateQuery = { $set: {} };
      Object.keys(resource).forEach((key) => {
        //@ts-ignore
        updateQuery.$set[key] = resource[key];
      });
      // set the last updated date
      //@ts-ignore
      updateQuery.$set["updatedAt"] = new Date();

      // verify if the form exists and if the user is the owner of the form
      const form = await this.model.findOneAndUpdate(
        { _id: formId, userId },
        updateQuery,
        { new: true }
      );
      //@ts-ignore
      return form;
    } catch (err: any) {
      throw {
        message: err.message || "Form not update",
        error: err,
        status: err.status || err.errorStatus || 404,
      };
    }
  }

  async get(resource: IGet): Promise<any> {
    try {
      // fetch the form by id and also increase the views by 1
      const form = await this.model.findByIdAndUpdate(resource.formId, {
        $inc: { views: 1 },
      });
      if (form) {
        return form;
      } else {
        throw { message: "form not found", status: 404 };
      }
    } catch (err: any) {
      throw {
        message: err.message || "Form not found",
        error: err,
        status: err.status || err.errorStatus || 404,
      };
    }
  }

  async delete(resource: IGet): Promise<any> {
    try {
      const form = await this.model.findByIdAndDelete(resource.formId);
      //@ts-ignore
      return form;
    } catch (err: any) {
      throw {
        message: err.message || "Failed to delete",
        error: err,
        status: err.status || err.errorStatus || 404,
      };
    }
  }

  async getAll(resource: IGetAll): Promise<any> {
    try {
      const pageSize = resource.pageSize || 10; // number of documents per page
      const currentPage = resource.page || 1; // current page number
      const skip = (currentPage - 1) * pageSize; // number of documents to be skipped
      return await this.model.aggregate([
        { $match: { userId: new Types.ObjectId(resource.userId) } }, // match the userId
        {
          $lookup: {
            from: "responses", // name of the responses collection
            localField: "_id", // field in the forms collection
            foreignField: "formId", // field in the responses collection
            as: "responses", // output array
          },
        },
        {
          $unwind: {
            path: "$responses",
            preserveNullAndEmptyArrays: true, // keep the documents that have an empty responses array
          },
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$header" }, // keep the header field
            socials: { $first: "$socials" }, // keep the socials field
            "Activation Date": { $first: "$activationDate" }, // keep the activationDate field
            "Group": { $first: { $ifNull: ["$collectionGroup", "none"] } }, // keep the group field
            "Last Updated": { $first: "$updatedAt" }, // keep the updatedAt field
            "Expiry Date": { $first: "$expiryDate" }, // keep the expiryDate field
            type: { $first: "$type" }, // keep the type field
            views: { $first: "$views" }, // keep the views field
            webhooks: { $first: "$webHooks" }, // keep the webhooks field
            total: { $sum: 1 }, // count the total number of responses
            telegram: {
              // count the responses from Telegram
              $sum: {
                $cond: [{ $eq: ["$responses.channel", "telegram"] }, 1, 0],
              },
            },
            whatsapp: {
              // count the responses from WhatsApp
              $sum: {
                $cond: [{ $eq: ["$responses.channel", "whatsapp"] }, 1, 0],
              },
            },
            web: {
              // count the responses from the web
              $sum: {
                $cond: [{ $eq: ["$responses.channel", "web"] }, 1, 0],
              },
            },
          },
        },
        { $sort: { _id: -1 } }, // sort the forms by descending order
        { $skip: skip }, // skip the documents that have already been fetched
        { $limit: pageSize }, // limit the number of documents to be fetched
        {
          $addFields: {
            // add the responses object to the form document
            responses: {
              // create a responses object
              total: "$total", // add the total responses
              telegram: "$telegram", // add the telegram responses
              whatsapp: "$whatsapp", // add the whatsapp responses
              web: "$web", // add the web responses
            },
            "_qs": {
              _id: "$_id",
            }
          },
        },
        {
          $project: {
            // project the fields to be returned
            _id: 1,
            title: 1,
            socials: 1,
            "Activation Date": 1,
            "Group": 1,
            "Last Updated": 1,
            "Expiry Date": 1,
            type: 1,
            views: 1,
            webhooks: 1,
            responses: 1,
          },
        }
      ]);
    } catch (err: any) {
      throw {
        message: err.message || "Failed to fetch forms",
        error: err,
        status: err.status || err.errorStatus || 404,
      };
    }
  }

  async fillForm(resource: IResponse): Promise<any> {
    try {
      // verify if the form exists and if it is active by feching only necessary fields
      const form = await this.model.findById(resource.formId).select('isActive isPublic').lean();
      if (form) {
        // @ts-ignore
        if (!form.isActive || !form.isPublic) {
         
          throw({message: 'form is not active', status: 400})
        }
      } else {
        throw({message: 'form not found', status: 404})
      }
      let filled = this.responseModel.create({
        ...resource,
      });
      // update the response count of the form
      await this.model.findByIdAndUpdate(resource.formId, {
        $inc: { responseCount: 1 },
      });
      //@ts-ignore
      return filled;
    } catch (err: any) {
      throw {
        message: err.message || "Failed to fetch forms",
        error: err,
        status: err.status || err.errorStatus || 404,
      };
    }
  }

  async getAllResponses({ formId, page, pageSize }: any): Promise<any> {
    try {
     const skip = (page - 1) * pageSize;
return await this.responseModel.aggregate([
  { $match: { formId: new Types.ObjectId(formId) } },
  {
    $lookup: {
      from: "form", // replace with your actual form collection name
      localField: "formId",
      foreignField: "_id",
      as: "form"
    }
  },
  { $unwind: "$form" }, // flatten the form array
  { 
    $addFields: {
      "data._qs": {
        _id: "$_id",
        channel: "$channel",
        createdTime: "$createdTime",
        timeTaken: "$timeTaken",
      },
      formTitle: "$form.header" // add the form title to the output
    }
  },
  {
    $project: {
      _id: 0,
      data: 1,
      formTitle: 1
    }
  }
]);
    } catch (err: any) {
      throw {
        message: err.message || "Failed to fetch responses",
        error: err,
        status: err.status || err.errorStatus || 404,
      };
    }
  }

  async countResponses({ formId }: any): Promise<any> {
    try {
      return await this.model.findById(formId).select("responseCount");
    } catch (err: any) {
      throw {
        message: err.message || "Failed to fetch responses",
        error: err,
        status: err.status || err.errorStatus || 404,
      };
    }
  }

  async getResponse({reponseId}: any): Promise<any> {
    try {
      return await this.responseModel.findById(reponseId);
    } catch (err: any) {
      throw {
        message: err.message || "Failed to fetch responses",
        error: err,
        status: err.status || err.errorStatus || 404,
      };
    }
  }
}

async function getResponse(user: { toObject: () => any }, isLogin?: boolean) {
  const userObj = user.toObject();
  userObj.userId = userObj._id;
  delete userObj.mobileToken;
  delete userObj.emailToken;
  delete userObj.password;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpiry;
  delete userObj.__v;
  delete userObj._id;

  // if the user is logging in, create a token using tokenizer.generateToken and using this.model.userId and unit as argument
  return {
    user: userObj,
  };
}

const generateJWT = (user: {
  userId: string;
  email: string;
  is_admin: Boolean;
}) => {
  return signToken(user);
};

const customResponse = async (userObj: any) => {
  delete userObj.password;
  delete userObj.mobileToken;
  delete userObj.emailToken;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpiry;
  delete userObj.__v;
  return userObj;
};

async function generateToken() {
  return Math.floor(Math.random() * 9000) + 1000;
}
export default new FormService();
