import { StandardForm, Input } from "../interfaces/forms.interface";
import Form from "../models/forms.model";

interface IForm {
  form: StandardForm;
  _id: string;
  // Add other properties of the form here
  lastAccessed: number;
  inputs: ITelegramInput[];
}

interface ITelegramInput extends Input {
  message: string | object;
  _id: string;
}

class FormBridge {
  private formCache: Map<string, IForm>;
  private staleForms: Map<string, IForm>;
  private formModel: any;

  constructor() {
    this.formCache = new Map();
    this.staleForms = new Map();
    this.formModel = Form;

    setInterval(() => {
      this.removeStaleForms();
      this.deleteStaleForm();
    }, 4 * 60 * 1000);
  }

  async fetchForm(
    formId: string,
    check: boolean = true
  ): Promise<boolean | IForm> {
    let formIsAvailable = false;
    if (this.formCache.has(formId)) {
      formIsAvailable = true;
    } else {
      let staled = this.staleForms.get(formId);
      if (staled) {
        this.formCache.set(formId, staled);
        this.staleForms.delete(formId);
        formIsAvailable = true;
      } else {
        let form = await this.formModel.findById(formId).exec();
        if (form) {
          form = form.toObject();
          form.form.inputs.forEach((input: any, index: number) => {
            // convert the input's object id from mongo to string
            input._id = input._id.toString();
            if (
              input.type === "emailOrMobile" ||
              input.type === "text" ||
              input.type === "email" ||
              input.type === "textarea" ||
              input.type === "autocomplete" ||
              input.type === "mobile"
            ) {
              input.telegram = [
                this.escapeMarkdown(`*${input.label}* \n\n${input.helperText || ""}`),
                {
                  parse_mode: 'MarkdownV2',
                  reply_markup: {
                    force_reply: true,
                  },
                },
                
              ];
              input.telegram_need_confirmation = true // for text inputs, the user must confirm the input before it is sent
            } else if (
              input.type === "select" ||
              input.type === "buttonGroup" ||
              input.type === "checkbox" ||
              input.type === "radio"
            ) {
              input.telegram = [
                this.escapeMarkdown(`*${input.label}*\n\n${input.helperText || ""}`),
                // create an inline keyboard for options of the input
                {
                  parse_mode: 'MarkdownV2',
                  reply_markup: {
                    inline_keyboard: input.options.map((option: any) => {
                      return [
                        {
                          text: option.label,
                          callback_data: formId,
                        },
                      ];
                    }),
                  },
                },
            ];
            input.telegram_need_confirmation = false // for select inputs, the user does not need to confirm the input before it is sent
            }
            input.nextInput =
              form.form.inputs.length > index + 1
                ? form.form.inputs[index + 1]._id.toString()
                : null;
          });
          form.lastAccessed = Date.now();
          this.formCache.set(formId, form);
          formIsAvailable = true;
        }
      }
    }

    return check
      ? formIsAvailable
      : formIsAvailable
      ? ((this.formCache.get(formId) || false) as IForm)
      : false;
  }

  async telegram(formId: string, inputId: string): Promise<ITelegramInput> {
    // Convert native web inputs to Telegram prompts
    const form = await this.fetchForm(formId, false);
    if (form && typeof form !== "boolean") {
      if (inputId === "0") {
        return form.form.inputs[0] as ITelegramInput;
      }
      return form.form.inputs.find(
        (input) => input._id === inputId
      ) as ITelegramInput;
    }
    return {} as ITelegramInput;
  }

  // create a method for escaping markdown characters
  escapeMarkdown(text: string): string {
    const characters = ['[', ']', '(', ')', '~',  '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']
    let escapedText = text
    characters.forEach(character => {
      const regex = new RegExp('\\' + character, 'g');
      escapedText = escapedText.replace(regex, `\\${character}`);
  });
    return escapedText
  }

  async whatsapp(formId: string, inputId: string): Promise<string> {
    // Convert native web inputs to WhatsApp prompts
    const form = this.formCache.get(formId);
    if (form) {
      form.lastAccessed = Date.now();
      // Access the form and input to perform the conversion
      return `WhatsApp prompt for form ${formId} and input ${inputId}`;
    }
    // the form may have been deleted. add it to the cache
    let formAvailable = await this.fetchForm(formId);
    if (formAvailable) {
      return `WhatsApp prompt for form ${formId} and input ${inputId}`;
    }
    return "";
  }

  removeStaleForms(): void {
    const now = Date.now();
    for (const [formId, form] of this.formCache.entries()) {
      if (now - form.lastAccessed > 4 * 60 * 1000) {
        this.formCache.delete(formId);
        this.staleForms.set(formId, form);
      }
    }
  }

  deleteStaleForm(munites: number = 24): void {
    const now = Date.now();
    for (const [formId, form] of this.staleForms.entries()) {
      if (now - form.lastAccessed > munites * 60 * 60 * 1000) {
        this.staleForms.delete(formId);
      }
    }
  }
}

export default new FormBridge();