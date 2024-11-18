const express = require('express');
import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from "@langchain/openai";
import { Request, Response, NextFunction } from 'express';


const app = express();
const port = 5000;

const prompt = `
  You are an AI dating coach. Provide advice based on the given images.

  For text conversation images:
  1. Read the conversation from left to right (their message, then your message).
  2. Assume the rightmost text is your message and the leftmost text is their message.
  3. Suggest three follow-up responses that mimic your texting style.

  For dating profile images:
  1. Come up with three pickup lines as potential options to "slide in."

  For multiple images:
  Clearly divide your answers, making it easy to identify which response corresponds to which image.
`;

async function processImages(imageUrls: string[]) {
  if (imageUrls.length === 0) {
    console.log("Sorry, but you have not provided any images.");
    return;
  }

  const limitedImageUrls = imageUrls.slice(0, 2);
  const imageDatas = await Promise.all(
    limitedImageUrls.map(url => fetch(url).then(res => res.arrayBuffer()))
  );

  const base64Images = imageDatas.map(data => Buffer.from(data).toString('base64'));
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  });

  const messageContent = [
      { type: "text", text: prompt },
    ...base64Images.map(base64Image => ({
        type: "image_url",
      image_url: { url: `data:image/jpeg;base64,${base64Image}` },
    })),
  ];

  const message = new HumanMessage({ content: messageContent });
  const imageDescriptionAiMsg = await llm.invoke([message]);
  let finalMessage = imageDescriptionAiMsg.content;

  if (imageUrls.length > 2) {
    finalMessage += "\n Currently I only take a max of two images so I have provided you answers for the first two here.";
}

  console.log(finalMessage);
  return finalMessage;
}

app.use(express.json({ limit: '50mb' })); 

app.post('/', async (req: Request, res: Response) => {
  try {

    const { imageUrls } = req.body;
    console.log(imageUrls)

    // Validate input
    if (!imageUrls || !Array.isArray(imageUrls)) {
      return res.status(400).send('Invalid input: `imageUrls` must be an array of strings.');
    }

    // Call the async function
    const data = await processImages(imageUrls); 
    
    // Send the result
    res.send(data);                       
  } catch (error) {
    res.status(500).send('An error occurred'); // Handle errors
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
