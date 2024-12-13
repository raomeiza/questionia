import mongoose, { Schema, model } from 'mongoose';

const Form = model('Form', new Schema({
  form: {
    title: {
      type: String,
      required: true,
    },
    url: { type: String, maxlength:250 },
    btnTxt: { type: String, maxlength: 15 },
    description: { type: String, maxlength: 500 },
    inputs: [{
      name: { type: String, required:true, maxlength: 50 },
      label: { type: String, required: true, maxlength:150 },
      type: { type: String,
        required: true,
        enum: ['text', 'email', 'button', 'mobile', 'date', 'datetime', 'time', 'select', 'radio', 'checkbox','emailOrMobile', 'password', 'emailormobile', 'file', 'autocomplete', 'textarea', 'number', 'switch', 'slider', 'rating', 'color', 'submit', 'reset', 'buttonGroup', 'signature', 'dropzone' ]
      },
      helperText: { type: String, maxlength: 300, required: false },
      variant: { type: String, enum: ['outlined', 'standard', 'contained', 'text', 'filled'], default: 'outlined', required: false },
      sx: { type: Object, default:null, required: false },
      fullWidth: { type: Boolean, default: true, required: false },
      validation: { type: Object, default: null, required: false },
      onClick: { type: String, default:null, required: false },
      options: [Object],
      localOnChange: { type: String, default:null, required:false },
      multiple: { type: Boolean, default:false, required: false },
      MaxSelection: { type: Number, default: 1, required: false },
      minSelection: { type: Number, default: 1, required: false },
    }],
    collectionGroup: { type: String, required: false   },
    onSubmitSuccess: { type: String, required: false   },
    onSubmitFailure: { type: String, required: false   },
    noSubmit: { type: Boolean, default:false, required: false   },
    beforeSubmit: { type: String, required: false   },
    clearForm: { type: Object, required: false  },
  },
  header: {
    type: String,
    required: true,
  },
  sx: { type: Object, default:null, required: false },
  webHooks: [String],
  channels: {type: String, enum: ['whatsapp', 'telegram', 'web'], default: 'web', required: false},
  createdAt: { type: Date, default: Date.now },
  responseCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  type: { type: String, enum: ['form', 'survey', 'quiz', 'questionniar'], default: 'form' },
  activationDate:{type: Date, default: new Date().toISOString()},
  deactivatioDate:{type: Date},
  deactivationReason:{type:String},
  updatedAt: { type: Date, default: Date.now },
  userId:{type: mongoose.Types.ObjectId, required: true},
  isActive: {
    type: Boolean,
    default: true,
  },

}), 'form');

export const ResponseModel = model('Response', new Schema({
  formId: { type: mongoose.Types.ObjectId, required: true },
  data: { type: Object, required: true },
  channel: { type: String, enum: ['whatsapp', 'telegram', 'web'], default: 'web' },
  userId: { type: mongoose.Types.ObjectId, required: false },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
}), 'responses');

export default Form;
