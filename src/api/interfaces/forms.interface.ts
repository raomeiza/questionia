export interface Input {
  name: string;
  label: string;
  type: 'email' | 'password' | 'text' | 'mobile' | 'date' | 'time' | 'date' | 'datetime' | 'radio' | 'select' | 'file' | 'button' | 'radiogroup' | 'autocomplete' | 'emailOrMobile' | 'checkbox' | 'textarea' | 'number' | 'switch' | 'slider' | 'rating' | 'color' | 'submit' | 'reset' | 'buttonGroup' //'button' | 'link' | 'heading' | 'paragraph' | 'html' | 'content' | 'columns' | 'table' | 'signature' | 'captcha' | 'paypal' | 'stripe' | 'divider' | 'spacer' | 'button' | 'columns' | 'section' | 'page' | 'header' | 'footer' | 'embed' | 'map' | 'gmap' | 'address' | 'recaptcha' | 'quiz' | 'quizscore' | 'quiztimer' | 'quizleaderboard' | 'quizcertificate' | 'quizsurvey' | 'quizpoll' | 'quiztally' 
  helperText?: string;
  // setHelperText?: string;
  // formError?: boolean;
  // setFormError?: boolean
  // setFormInputValueOrError?: string
  Variant?: 'outline' | 'standard' | 'contained' | 'text';
  sx?: { [x: string]: any };
  fullWidth?: boolean
  validation?: any
  onClick?: string;
  // localOnChange: string;
  [x: string]: any;
}

export interface StandardForm {
  title?: string;
  url?: string;
  inputs: Input[];
  btnTxt?: string;
  noSubmit?: boolean;
  onSubmitSuccess?: string;
  onSubmitFailure?: string;
  beforeSubmit?: string;
  clearForm?: string

}

export interface ICreate {
  form: StandardForm,
  header: string,
  sx?: { [x: string]: any },
  activationDate?: string,
  expiryDate?: string,
  social?: {
    whatsapp: boolean
    telegram: boolean
  },
  webHooks?: string[]
  collectionGroup?: string,
  userId: string
}

export interface IUpdate extends ICreate {
  formId: string
}


export interface IGet {
  formId: string;
}
export interface IGetAll { }

export interface IDelete {
  formId: string
}



export default interface IFormService {
  model: any;
  create(resource: ICreate): Promise<any>;
  delete(resource: IDelete): Promise<any>;
  Update(resource: IUpdate): Promise<any>;
  get(resource: IGet): Promise<any>;
  getAll(resource: IGetAll): Promise<any>;
}
