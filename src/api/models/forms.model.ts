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
        enum: ['text', 'email', 'button', 'mobile', 'date', 'datetime', 'time', 'select', 'radio', 'checkbox','emailOrMobile', 'password', 'emailormobile', 'file', 'autocomplete', 'textarea', 'number', 'switch', 'slider', 'rating', 'color', 'submit', 'reset', 'buttonGroup' ]
      },
      helperText: { type: String, maxlength: 300, required: false },
      variant: { type: String, enum: ['outlined', 'standard', 'contained', 'text', 'filled'], default: 'outlined', required: false },
      sx: { type: Object, default:null, required: false },
      fullWidth: { type: Boolean, default: true, required: false },
      validation: { type: Object, default: null, required: false },
      onClick: { type: String, default:null, required: false },
      options: [Object],
      localOnChange: { type: String, default:null, required:false },
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
  socials: {
    whatsapp: Boolean,
    telegram: Boolean
  },

  userId:{type: mongoose.Types.ObjectId, required: true}

}), 'form');

export default Form;
