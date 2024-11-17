require('dotenv').config();
const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
const axios = require('axios');
const Twilio = require('twilio');
const extName = require('ext-name');
const urlUtil = require('url');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');




const PUBLIC_DIR = './public/mms_images';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const NODE_ENV = 'production'

console.log('Twilio Configuration:');
console.log(`TWILIO_PHONE_NUMBER: ${twilioPhoneNumber}`);
console.log(`TWILIO_ACCOUNT_SID: ${twilioAccountSid}`);
console.log(`TWILIO_AUTH_TOKEN: ${twilioAuthToken}`);

const app = express();
const port = 3000;

function getTwilioClient() {
  return twilioClient || new Twilio(twilioAccountSid, twilioAuthToken);
}

app.use(express.urlencoded({ extended: true }));

app.post('/incoming', async (req, res) => {
  const { body } = req;
  const { NumMedia, From: SenderNumber, MessageSid } = body;
  let saveOperations = [];
  const mediaItems = [];

  for (var i = 0; i < NumMedia; i++) {  // eslint-disable-line
    const mediaUrl = body[`MediaUrl${i}`];
    const contentType = body[`MediaContentType${i}`];
    const extension = extName.mime(contentType)[0].ext;
    const mediaSid = path.basename(urlUtil.parse(mediaUrl).pathname);
    const filename = `${mediaSid}.${extension}`;

    mediaItems.push({ mediaSid, MessageSid, mediaUrl, filename });
    //saveOperations = mediaItems.map(mediaItem => SaveMedia(mediaItem));
  }

  //await Promise.all(saveOperations);

  const messageBody = NumMedia === 0 ?
  'Send us an image!' :
  `Thanks for sending us ${NumMedia} file(s)`;

  const response = new MessagingResponse();
  response.message({
    from: twilioPhoneNumber,
    to: SenderNumber,
  }, messageBody);

  return res.send(response.toString()).status(200);
});


app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});