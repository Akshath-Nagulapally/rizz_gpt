require("dotenv").config();
const express = require("express");
const { MessagingResponse } = require("twilio").twiml;
const axios = require("axios");
const Twilio = require("twilio");
const extName = require("ext-name");
const urlUtil = require("url");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

/**
 * Define constants for application configuration.
 * - PUBLIC_DIR: directory where public files (MMS images) are stored.
 * - twilioPhoneNumber: the Twilio phone number from environment variables.
 * - twilioAccountSid: the Twilio account SID from environment variables.
 * - twilioAuthToken: the Twilio auth token from environment variables.
 * - NODE_ENV: the Node.js environment (production).
 * - langchainApiUrl: the URL of the Langchain API.
 */
const PUBLIC_DIR = "./public/mms_images";
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const NODE_ENV = "production";
const langchainApiUrl =
  process.env.LANGCHAIN_API_URL || "http://localhost:5000";



//Create an Express.js application and define its port.
const app = express();
const port = 3000;


//Create a Twilio client using the account SID and auth token.
function getTwilioClient() {
  return twilioClient || new Twilio(twilioAccountSid, twilioAuthToken);
}

//Send a POST request to the Langchain API to retrieve a response.
async function getLLMResponse(imageUrls, userMessage, phoneNumberId) {
  let response;

  console.log("right now just logging:", userMessage);
  try {
    response = await axios.post(langchainApiUrl, {
      imageUrls,
      userMessage,
      phoneNumberId,
    });
  } catch (error) {
    console.error("Error:", error);
  }
  return response;
}

//Configure Express.js to parse URL-encoded request bodies.
app.use(express.urlencoded({ extended: true }));

//Handle incoming Twilio requests.
app.post("/incoming", async (req, res) => {
  const { body } = req;
  const { NumMedia, From: senderNumber, MessageSid } = body;
  const { Body: textMessage } = body;
  const receivedTextMessage = body.Body || "";

  //Define an array to store media items.
  const mediaItems = [];

  //Define an array to store media URLs.
  const mediaUrlArray = [];

  //Iterate over the media items and extract relevant data.
  for (var i = 0; i < NumMedia; i++) {
    // eslint-disable-line
    const mediaUrl = body[`MediaUrl${i}`];
    const contentType = body[`MediaContentType${i}`];
    const extension = extName.mime(contentType)[0].ext;
    const mediaSid = path.basename(urlUtil.parse(mediaUrl).pathname);
    const filename = `${mediaSid}.${extension}`;
    mediaItems.push({ mediaSid, MessageSid, mediaUrl, filename });
  }

  //Extract media URLs from the media items.
  for (const x of mediaItems) {
    mediaUrlArray.push(x.mediaUrl);
  }

  console.log(
    "------------------------------------ LLM message -------------------------------",
  );

  const responseData = await getLLMResponse(
    mediaUrlArray,
    receivedTextMessage,
    senderNumber,
  );

  console.log(responseData.data);

  console.log(
    "-------------------------------- end of LLM message ----------------------------",
  );

  const messageBody =
    Number(NumMedia) === 0 ? "Send me an image!" : `${responseData.data}`;

  const response = new MessagingResponse();

  response.message(
    {
      from: twilioPhoneNumber,
      to: senderNumber,
    },
    messageBody,
  );


  return res.send(response.toString()).status(200);
});

//Start the Express.js server.

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
