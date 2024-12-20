require("dotenv").config();
const express = require("express");
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { Request, Response, NextFunction } from "express";

// defining twilio credentials for accessing http protected images
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Initialize the express app and set the port
const app = express();
const port = 5000;

// Define the prompt for the AI dating coach
const prompt = `
  You are an AI dating coach. Provide advice based on the given images.

  For text conversation images:
  1. Read the conversation from left to right (their message, then your message).
  2. Assume the rightmost text is your message and the leftmost text is their message.
  3. Suggest three follow-up responses that mimic your texting style.

  For dating profile images:
  1. Come up with three pickup lines as potential options to "slide in."
  2. Personalize it based on the dating profile description, if its not there find some way to personalize it
  3. all the images can be of the same dating profile so be aware of this case.

  For multiple images:
  Clearly divide your answers, making it easy to identify which response corresponds to which image.
`;

// Initialize the AI model
const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });

// Process the images and generate a response
async function processImages(
  imageUrls: string[],
  userMessage: string,
  userId: string,
) {
  if (imageUrls.length === 0) {
    console.log("Sorry, but you have not provided any images.");
    return;
  }

  // Limit the number of images to 2 for processing
  const limitedImageUrls = imageUrls.slice(0, 2);

  const imageDatas = await Promise.all(
    limitedImageUrls.map((url) =>
      fetch(url, {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        },
      }).then((res) => res.arrayBuffer()),
    ),
  );

  // Convert the image data to base64 strings
  const base64Images = imageDatas.map((data) =>
    Buffer.from(data).toString("base64"),
  );

  const promptWithUserMessage = prompt + "User Message: " + userMessage;

  // Define the message content for the AI model
  const messageContent = [
    { type: "text", text: promptWithUserMessage },
    ...base64Images.map((base64Image) => ({
      type: "image_url",
      image_url: { url: `data:image/jpeg;base64,${base64Image}` },
    })),
  ];

  const metadata = { user_id: userId };

  // Create a new HumanMessage instance
  const message = new HumanMessage({
    content: messageContent,
    response_metadata: metadata,
  });

  // Invoke the AI model and generate a response
  const imageDescriptionAiMsg = await llm.invoke([message]);
  let finalMessage = imageDescriptionAiMsg.content;

  // Add a note for cases where more than 2 images are provided
  if (imageUrls.length > 2) {
    finalMessage +=
      "\n Currently I only take a max of two images so I have provided you answers for the first two here.";
  }

  // Log and return the final response
  console.log(finalMessage);
  return finalMessage;
}

// Set up the express app to accept large JSON payloads
app.use(express.json({ limit: "50mb" }));

// Define the endpoint to process images
app.post("/", async (req: Request, res: Response) => {
  try {
    // Extract the image URLs from the request body
    const { imageUrls } = req.body;
    const { phoneNumberId } = req.body;
    const { userMessage } = req.body;

    // Validate the input image URLs
    if (!imageUrls || !Array.isArray(imageUrls)) {
      return res
        .status(400)
        .send("Invalid input: `imageUrls` must be an array of strings.");
    }

    // Process the images and generate a response
    const data = await processImages(imageUrls, userMessage, phoneNumberId);

    // Send the response
    res.send(data);
  } catch (error) {
    // Handle errors
    res.status(500).send("An error occurred");
  }
});

// Start the express app
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
