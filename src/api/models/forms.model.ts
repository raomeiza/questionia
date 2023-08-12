import mongoose, { Schema, model } from 'mongoose';

const Form = model('Form', new Schema({
  form: {
    title: {
      type: String,
      required: true,
    },
    url: { type: String, maxlength:250 },
    btnTxt: { type: String, maxlength: 15 },
    inputs: [{
      name: { type: String, required:true, maxlength: 50 },
      label: { type: String, required: true, maxlength:150 },
      type: { type: String,
        required: true,
        enum: ['text', 'email', 'button', 'mobile', 'date', 'datetime', 'time', 'select', 'radio', 'checkbox','emailOrMobile', 'password', 'emailormobile', 'file', 'autocomplete', 'textarea']
      },
      helperText: { type: String, maxlength: 300, required: false },
      variant: { type: String, enum: ['outlined', 'default', 'contained'], default: 'outlined', required: false },
      sx: { type: Object, default:null, required: false },
      fullWidth: { type: Boolean, default: true, required: false },
      validation: { type: Object, default: null, required: false },
      onClick: { type: String, default:null, required: false },
      options: [Object],
      localOnChange: { type: String, default:null, required:false },
    }],
    collectionGroup: { type: String, default:null, required: false   },
    onSubmitSuccess: { type: String, default:null, required: false   },
    onSubmitFailure: { type: String, default:null, required: false   },
    noSubmit: { type: Boolean, default:false, required: false   },
    beforeSubmit: { type: String, default:null, required: false   },
    clearForm: { type: Object, default:null, required: false  },
  },
  webHooks: [String],
  socials: {
    whatsapp: Boolean,
    telegram: Boolean
  },
  userId:{type: mongoose.Types.ObjectId, required: true}

}), 'form');
export default Form;
