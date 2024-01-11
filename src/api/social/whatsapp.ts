import WhatsApp from "whatsapp";
import app from "../index";

const {
  QUESTIONIA_WHATSAPP_CLOUD_ID,
  QUESTIONIA_WHATSAPP_CLOUD_TOKEN,
  FACEBOOK_WEBHOOK_VERIFY_TOKEN,
} = process.env;

if (
  !QUESTIONIA_WHATSAPP_CLOUD_ID ||
  !QUESTIONIA_WHATSAPP_CLOUD_TOKEN ||
  !FACEBOOK_WEBHOOK_VERIFY_TOKEN
) {
  throw new Error(
    "QUESTIONIA_WHATSAPP_CLOUD_ID or QUESTIONIA_WHATSAPP_CLOUD_TOKEN is not defined"
  );
}

const senderNumber = 12345678901234567890;
const wa = new WhatsApp();

function custom_callback ( statusCode: any, headers: any, body: any, resp: { writeHead: (arg0: number, arg1: { "Content-Type": string; }) => void; end: () => void; }, err: any )
{
    console.log(
        `Incoming webhook status code: ${ statusCode }\n\nHeaders:
        ${ JSON.stringify( headers ) }\n\nBody: ${ JSON.stringify( body ) }`
    );

    if( resp )
    {
        resp.writeHead(200, { "Content-Type": "text/plain" });
        resp.end();
    }

    if( err )
    {
        console.log( `ERROR: ${ err }` );
    }
}
// @ts-ignore
const server = wa.webhooks.start( custom_callback )
// @ts-ignore
app.use('/webhook', wa.webhooks.server );

export default wa;