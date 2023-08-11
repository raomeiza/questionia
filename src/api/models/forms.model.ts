import { Schema, model } from 'mongoose';

const Form = model('Form', new Schema({
  form: {
    name: {
      type: String,
      required: true,
    },
    url: { type: String, maxlength:250 },
    btnTxt: { type: String, maxlength: 15 },
    inputs: [{
      name: { type: String, required:true, maxlength: 25 },
      label: { type: String, required: true, maxlength:25 },
      type: { type: String,
        required: true,
        enum: ['text', 'email', 'button', 'mobile', 'date', 'datetime', 'time', 'select', 'radio', 'checkbox','emailOrMobile', 'password']
      },
      helperText: { type: String, maxlength: 300 },
      variant: { type: String, enum: ['outlined', 'default', 'contained'], default: 'outlined' },
      sx: { type: Object },
      fullWidth: { type: Boolean, default: true },
      validation: { type: Object },
      onClick: { type: String },
      options: [String],
      localOnChange: { type: String },
    }],
    collectionGroup: { type: String },
    onSubmitSuccess: { type: String },
    onSubmitFailure: { type: String },
    noSubmit: { type: Boolean },
    beforeSubmit: { type: String },
    clearForm: { type: String },
  },
  webHooks: [String],
  socials: {
    whatsapp: Boolean,
    telegram: Boolean
  },

}), 'form');
export default Form;
