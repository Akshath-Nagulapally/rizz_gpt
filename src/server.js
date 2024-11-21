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

/**
 * Log Twilio configuration details to the console.
 */
console.log("Twilio Configuration:");
console.log(`TWILIO_PHONE_NUMBER: ${twilioPhoneNumber}`);
console.log(`TWILIO_ACCOUNT_SID: ${twilioAccountSid}`);
console.log(`TWILIO_AUTH_TOKEN: ${twilioAuthToken}`);

/**
 * Create an Express.js application and define its port.
 */
const app = express();
const port = 3000;

/**
 * Create a Twilio client using the account SID and auth token.
 * @returns {Twilio}
 */
function getTwilioClient() {
  return twilioClient || new Twilio(twilioAccountSid, twilioAuthToken);
}

/**
 * Send a POST request to the Langchain API to retrieve a response.
 * @param {string[]} imageUrls - an array of image URLs.
 * @returns {Promise<AxiosResponse>}
 */
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

/**
 * Configure Express.js to parse URL-encoded request bodies.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Handle incoming Twilio requests.
 * @param {Request} req - the incoming request.
 * @param {Response} res - the outgoing response.
 */
app.post("/incoming", async (req, res) => {
  /**
   * Extract relevant data from the request body.
   * - NumMedia: the number of media items.
   * - SenderNumber: the sender's phone number.
   * - MessageSid: the message SID.
   */
  const { body } = req;
  const { NumMedia, From: senderNumber, MessageSid } = body;
  const { Body: textMessage } = body;
  const receivedTextMessage = body.Body || "";
  console.log(
    `Text message received from ${senderNumber}: ${receivedTextMessage}`,
  );

  /**
   * Define an array to store media items.
   */
  const mediaItems = [];

  /**
   * Define an array to store media URLs.
   */
  const mediaUrlArray = [];

  /**
   * Iterate over the media items and extract relevant data.
   * - MediaUrl{i}: the media URL.
   * - MediaContentType{i}: the media content type.
   * - extension: the file extension from the MIME type.
   * - mediaSid: the media SID.
   * - filename: the filename.
   */
  for (var i = 0; i < NumMedia; i++) {
    // eslint-disable-line
    const mediaUrl = body[`MediaUrl${i}`];
    const contentType = body[`MediaContentType${i}`];
    console.log("content Type", contentType);
    const extension = extName.mime(contentType)[0].ext;
    const mediaSid = path.basename(urlUtil.parse(mediaUrl).pathname);
    const filename = `${mediaSid}.${extension}`;
    mediaItems.push({ mediaSid, MessageSid, mediaUrl, filename });
  }

  /**
   * Extract media URLs from the media items.
   */
  for (const x of mediaItems) {
    mediaUrlArray.push(x.mediaUrl);
  }

  /**
   * Log media URLs to the console.
   */
  console.log(mediaUrlArray);

  /**
   * Log a message to indicate the start of LLM processing.
   */
  console.log(
    "------------------------------------ LLM message -------------------------------",
  );

  /**
   * Send a POST request to the Langchain API and retrieve a response.
   */
  const responseData = await getLLMResponse(
    mediaUrlArray,
    receivedTextMessage,
    senderNumber,
  );

  /**
   * Log the LLM response data to the console.
   */
  console.log(responseData.data);

  /**
   * Log a message to indicate the end of LLM processing.
   */
  console.log(
    "-------------------------------- end of LLM message ----------------------------",
  );

  /**
   * Define the message body for the Twilio response.
   */
  const messageBody =
    Number(NumMedia) === 0 ? "Send me an image!" : `${responseData.data}`;

  /**
   * Create a Twilio MessagingResponse object.
   */
  const response = new MessagingResponse();

  /**
   * Add a message to the Twilio response.
   */
  response.message(
    {
      from: twilioPhoneNumber,
      to: senderNumber,
    },
    messageBody,
  );

  /**
   * Return the Twilio response.
   */
  return res.send(response.toString()).status(200);
});

/**
 * Start the Express.js server.
 */
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
