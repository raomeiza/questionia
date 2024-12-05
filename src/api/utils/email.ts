import Mailgun from "mailgun.js";
import FormData from "form-data";
import { BASE_URL, MAILGUN_API_KEY } from "../../config";

const mailgun = new Mailgun(FormData);
if(MAILGUN_API_KEY === undefined) throw new Error('MAILGUN_API_KEY is not set');
  const mg = mailgun.client({username: 'api', key: MAILGUN_API_KEY });

// create a html email template for all our emails
// it should conttain a header carying the company name (AUTHENTIFY)
// then, the body of the email. this will always be replaced by the email content
// then, a footer containing the company address and contact information as well as a link to the company website
// the body of the email should contain the email subject and the email content
// the whole email should be styled with a font-family of sans-serif, a font-size of 16px and a line-height of 1.5, well padded, 
// the header should have a font-size of 24px and a font-weight of bold, after it should be a divider line, the whole html should have white bacground color, blue text color and a border-radius of 10px

const emailTemplate = (emailSubject: string, emailContent: string) => {
    return `
    <html>
        <head>
            <style>
                body {
                    font-family: sans-serif;
                    font-size: 16px;
                    line-height: 1.5;
                    padding: 20px;
                    background-color: white;
                    color: blue;
                    border-radius: 10px;
                }
                h1 {
                    font-size: 24px;
                    font-weight: bold;
                }
                hr {
                    border: 1px solid blue;
                }
            </style>
        </head>
        <body>
            <h1>AUTHENTIFY</h1>
            <hr>
            <p><strong>${emailSubject}</strong></p>
            <p>${emailContent}</p>
            <hr>
            <p>Company Address: 1234 Main Street, Lagos, Nigeria</p>
            <p>Company Phone: +234 123 456 7890</p>
            <p>Company Email:<a href="mailto:service.authentify.tech">service.authentify.tech</a></p>
            <p>Company Website:<a href="https://authentify.tech">authentify.tech</a></p>
        </body>
    </html>
    `;
}

// On every server start, we will send an email to the admin to notify them that the server has started
// this is to ensure that the admin is aware of the server status
export const  msg = {
    from: 'dev@questioniar.com.ng',
    to: 'blesseth.omeiza@gmail.com',
    subject: 'Server Started',
    html: emailTemplate(`Server started at ${new Date().toLocaleString()}`, `The server has started successfully. You can now access the server at ${BASE_URL}`),
    text: `The server started successfully at ${new Date().toLocaleString()}. You can now access the server at ${BASE_URL}`
}

export const startMsg = async () => {
mg.messages.create('service.authentify.tech', msg).then((body) => {
    console.log(body);
}).catch((error) => {
    console.error(error);
});
}

// export a function that sends an email to the user
// it should receive a text, subject and email address
// and format them to both html and text emails and send to the receiver. and should be an async function
const sendEmail = async (text: string, subject: string, email: string) => {
    const msg = {
        from: 'service@questioniar.com.ng',
        to: email,
        subject: subject,
        html: emailTemplate(subject, text),
        text: text
    }

    return mg.messages.create('service.authentify.tech', msg);
}

export default sendEmail;
