import Form, { ResponseModel } from "../models/forms.model";

export interface IFormConfig {
  questionType?: 'paged' | 'single' | 'default'
  welcomeScreen?: {
    enabled?: boolean,
    enableAgreeToTerms?: boolean,
    startBtnTxt?: string,
    agreeToTermsTxt?: string,
    alwaysAvailable?: boolean
  },
  thankYouScreen?: {
    enabled?: boolean,
    title?: string,
    message?: string,
    enableAction?: boolean,
    action?:
       {
          type: "qrCode";
          source: "responseId" | "formField";
          formField?: string;
          download: boolean;
          copyCode: boolean;
        }
      | {
          type: "link";
          linkText: string;
          url: string;
          redirect: boolean;
          delay: number;
        }
      | {
          type: "form";
          formId: string;
          delay: number;
          passFieldValues: boolean;
          fields: string[];
          matchingFields: string[];
        }
  },
  questions?: {
    allowPrevious?: boolean,
    allowEdit?: boolean,
    type?: 'default' | 'paged' | 'single'
  }
}

export const sampleFormConfig: IFormConfig = {
  questionType: 'default',
  welcomeScreen: {
    enabled: false,
    enableAgreeToTerms: false,
    startBtnTxt: 'Start',
    agreeToTermsTxt: '',
    alwaysAvailable: false
  },
  thankYouScreen: {
    enabled: false,
    title: 'Thank You',
    message: 'Your response has been recorded.',
    enableAction: false,
    action: {
      type: 'link',
      linkText: 'Continue',
      url: '',
      redirect: false,
      delay: 0
    }
  },
  questions: {
    allowPrevious: true,
    allowEdit: true
  }
}

export interface Input {
  name: string;
  label: string;
  type: 'email' | 'password' | 'text' | 'mobile' | 'date' | 'time' | 'date' | 'datetime' | 'radio' | 'select' | 'file' | 'button' | 'radiogroup' | 'autocomplete' | 'emailOrMobile' | 'checkbox' | 'textarea' | 'number' | 'switch' | 'slider' | 'rating' | 'color' | 'submit' | 'reset' | 'buttonGroup' | 'signature' | 'dropzone' //'button' | 'link' | 'heading' | 'paragraph' | 'html' | 'content' | 'columns' | 'table' | 'signature' | 'captcha' | 'paypal' | 'stripe' | 'divider' | 'spacer' | 'button' | 'columns' | 'section' | 'page' | 'header' | 'footer' | 'embed' | 'map' | 'gmap' | 'address' | 'recaptcha' | 'quiz' | 'quizscore' | 'quiztimer' | 'quizleaderboard' | 'quizcertificate' | 'quizsurvey' | 'quizpoll' | 'quiztally' 
  helperText?: string;
  // setHelperText?: string;
  // formError?: boolean;
  // setFormError?: boolean
  // setFormInputValueOrError?: string
  Variant?: 'outline' | 'standard' | 'contained' | 'text';
  sx?: { [x: string]: any } |null;
  fullWidth?: boolean
  validation?: any
  onClick?: string;
  // localOnChange: string;
  [x: string]: any;
}

export const sampleInputs: Input[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    helperText: 'Please enter your name',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true,
      minLength: 3,
      maxLength: 50
    }
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    helperText: 'Please enter your email',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true,
      email: true
    }
  },
  {
    name: 'mobile',
    label: 'Mobile',
    type: 'mobile',
    helperText: 'Please enter your mobile number',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true,
      minLength: 10,
      maxLength: 10
    }
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    helperText: 'Please enter your password',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true,
      minLength: 6,
      maxLength: 20
    }
  },
  {
    name: 'date',
    label: 'Date',
    type: 'date',
    helperText: 'Please enter your date of birth',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true
    }
  },
  {
    name: 'time',
    label: 'Time',
    type: 'time',
    helperText: 'Please enter the time',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true
    }
  },
  {
    name: 'datetime',
    label: 'DateTime',
    type: 'datetime',
    helperText: 'Please enter the date and time',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true
    }
  },
  {
    name: 'radio',
    label: 'Radio',
    type: 'radio',
    helperText: 'Please select an option',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true
    },
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' }
    ]
  },
  {
    name: 'select',
    label: 'Select',
    type: 'select',
    helperText: 'Please select an option',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true
    },
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' }
    ]
  },
  {
    name: 'file',
    label: 'File',
    type: 'file',
    helperText: 'Please upload a file',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true
    }
  },
  {
    name: 'button',
    label: 'Button',
    type: 'button',
    helperText: 'Please click the button',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true
    }
  },
  {
    name: 'radiogroup',
    label: 'Radio Group',
    type: 'radiogroup',
    helperText: 'Please select an option',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true
    },
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' }
    ]
  },
  {
    name: 'autocomplete',
    label: 'Autocomplete',
    type: 'autocomplete',
    helperText: 'Please select an option',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true
    },
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' }
    ]
  },
  {
    name: 'emailOrMobile',
    label: 'Email or Mobile',
    type: 'emailOrMobile',
    helperText: 'Please enter your email or mobile number',
    fullWidth: true,
    variant: 'outlined',
    validation: {
      required: true
    }
  }
]

export interface StandardForm {
  title?: string;
  description?: string;
  url?: string;
  inputs: Input[];
  btnTxt?: string;
  noSubmit?: boolean;
  onSubmitSuccess?: string;
  onSubmitFailure?: string;
  beforeSubmit?: string;
  clearForm?: string
  config?: IFormConfig
}

export const sampleForm: StandardForm = {
  title: 'Sample Form',
  description: 'This is a sample form',
  url: 'sample-form',
  inputs: sampleInputs,
  btnTxt: 'Submit'
}
export interface ICreate {
  form: StandardForm,
  header: string,
  sx?: { [x: string]: any },
  activationDate?: string,
  channels?: ('whatsapp' | 'telegram' | 'web' | 'embedded')[],
  webHooks?: string[]
  collectionGroup?: string,
  userId: string,
  type?: 'form' | 'survey' | 'quiz' | 'questionniar'
  status?: 'draft' | 'active' | 'inactive'
  activatesOn?: string
  deactivatesOn?: string
  responseCountThreshold?: number
  isActive?: boolean
  activeStateChangedReason?: 'expired' | 'deactivated' | 'deleted' | 'response_count' | 'system'
  access?: "public" | "private" //| "protected"
  password?: string
}

export const sampleCreate: ICreate = {
  form: sampleForm,
  header: 'Sample Form',
  userId: 'userId',
  sx: {
    color: 'red'
  },
  activationDate: new Date().toISOString(),
  channels: ['web'],
  webHooks: ['webhook'],
  collectionGroup: 'sample',
  type: 'form',
  status: 'draft',
  activatesOn: new Date().toISOString(),
  deactivatesOn: new Date().toISOString(),
  responseCountThreshold: 10,
}

export interface IUpdateFormActivation {
  formId: string,
  activatesOn: string
  deactivatesOn: string
  responseCountThreshold: number
}

export interface IGet {
  formId: string;
}

export interface IResponse extends IGet {
  data: object
  channel: 'web' | 'whatsapp' | 'telegram',
  fillId?: string
}

export interface IGetAll { userId: string, page?: number, limit?: number, skip?: number }

export interface IDelete {
  formId: string
}



export default interface IFormService {
  model: typeof Form;
  responseModel: typeof ResponseModel;
  create(resource: ICreate): Promise<any>;
  delete(resource: IDelete): Promise<any>;
  Update(resource: ICreate, formId: string, userId: string): Promise<any>;
  get(resource: IGet): Promise<any>;
  getAll(resource: IGetAll): Promise<any>;
  fillForm(resource: IResponse): Promise<any>;
}
