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
      required: { type: Boolean, default: false, required: false },
      controls: { type: Object, default:null, required: false },
    }],
    config: {
      questionType: { type: String, enum: ['paged', 'single', 'default'], default: 'default', required: false },
      welcomeScreen: {
        enabled: { type: Boolean, default: false, required: false },
        enableAgreeToTerms: { type: Boolean, default: false, required: false },
        startBtnTxt: { type: String, default: 'Start', required: false, maxlength: 15 },
        agreeToTermsTxt: { type: String, required: false, maxlength: 100 },
        alwaysAvailable: { type: Boolean, default: false, required: false },
      },
      thankYouScreen: {
        enabled: { type: Boolean, default: false, required: false },
        title: { type: String, default: 'Thank You', required: false, maxlength: 100 },
        message: { type: String, default: 'Your response has been recorded.', required: false, maxlength: 300 },
        enableAction: { type: Boolean, default: false, required: false },
        action: {
          type: { type: String, enum: ['qrCode', 'link', 'form'], required: false },
          source: { type: String, enum: ['responseId', 'formField'], required: false },
          formField: { type: String, required: false },
          download: { type: Boolean, default: false, required: false },
          copyCode: { type: Boolean, default: false, required: false },
          linkText: { type: String, required: false },
          url: { type: String, required: false },
          redirect: { type: Boolean, default: false, required: false },
          delay: { type: Number, default: 0, required: false },
          formId: { type: String, required: false },
          passFieldValues: { type: Boolean, default: false, required: false },
          fields: { type: [String], required: false },
          matchingFields: { type: [String], required: false },
        }
      },
      questionsConfig: {
        allowPrevious: { type: Boolean, default: true, required: false },
        allowEdit: { type: Boolean, default: true, required: false },
      },
      // variant: { type: String, enum: ['outlined', 'standard', 'contained', 'text', 'filled'], default: 'outlined', required: false },
      // sx: { type: Object, default:null, required: false },
      // fullWidth: { type: Boolean, default: true, required: false },
      // spacing: { type: Number, default: 2, required: false },
      // autoComplete: { type: String, default: 'off', required: false },
      // noValidate: { type: Boolean, default: false, required: false },
      // onSubmit: { type: String, required: false },
      // onReset: { type: String, required: false },
      // onKeyPress: { type: String, required: false },
      // onSubmitSuccess: { type: String, required: false },
      // onSubmitFailure: { type: String, required: false },
      // noSubmit: { type: Boolean, default:false, required: false },
      // beforeSubmit: { type: String, required: false },
      // clearForm: { type: Object, required: false },
    },
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
  channels: {type: String, enum: ['whatsapp', 'telegram', 'web', 'embedded'], default: 'web', required: false},
  createdAt: { type: Date, default: Date.now },
  responseCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  type: { type: String, enum: ['form', 'survey', 'quiz', 'questionniar'], default: 'form' },
  activatedOn:{type: Date, default: new Date().toISOString()},
  deactivatedOn:{type: Date},
  activatesOn:{type: Date},
  deactivatesOn:{type: Date},
  activationReason:{type:String},
  deactivationReason:{type:String,},
  responseCountThreshold:{type: Number, required: false}, // if response count is greater than this, form will be deactivated
  updatedAt: { type: Date, default: Date.now },
  userId:{type: mongoose.Types.ObjectId, required: true, ref: 'User'},
  updatedBy: { type: mongoose.Types.ObjectId, required: false, default: null, ref: 'User' },
  isActive: {
    type: Boolean,
    default: true,
  },
  activeStateChangedBy: { type: mongoose.Types.ObjectId, required: false, default: null, ref: 'User' },
  activeStateChangedAt: { type: Date, default: Date.now },
  activeStateChangedReason: { type: String, enum: ['expired', 'deactivated', 'deleted', 'response_count', 'system' ], default: 'system' },
  draftForms: [{ type: mongoose.Types.ObjectId, required: false, default: null, ref: 'Form' }],
  mainForm: { type: mongoose.Types.ObjectId, required: false, default: null, ref: 'Form' },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive'],
    default: 'draft',
  },
  statusChangedBy: { type: mongoose.Types.ObjectId, required: false, default: null, ref: 'User' },
  statusChangedAt: { type: Date, default: Date.now },
  access: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  password: { type: String, required: false },
  accessChangedBy: { type: mongoose.Types.ObjectId, required: false, default: null, ref: 'User' },
  accessChangedAt: { type: Date, default: Date.now },
}), 'form');

// for every update, log the changes
Form.schema.pre('findOneAndUpdate', function(this: mongoose.Query<any, any>, next) {
  const update = this.getUpdate();
  console.log('update', update);
  // this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

export const ResponseModel = model('Response', new Schema({
  formId: { type: mongoose.Types.ObjectId, required: true },
  data: { type: Object, required: true },
  channel: { type: String, enum: ['whatsapp', 'telegram', 'web'], default: 'web' },
  userId: { type: mongoose.Types.ObjectId, required: false },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
}), 'responses');

export default Form;
