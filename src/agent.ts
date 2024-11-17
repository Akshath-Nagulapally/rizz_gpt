const express = require('express');
import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from "@langchain/openai";
import { Request, Response, NextFunction } from 'express';


const app = express();
const port = 5000;

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
      { type: "text", text: "Divide your answers cleanly and clearly based on the image number. You are an AI dating coach. If the image is of a text conversation provide three followups and try to emulate my texting style. Always remember that the rightmost text is what I said and leftmost is what they said. You need to suggest to me what I CAN SAY. If image is of a dating profile then come up with three pickup lines to slide in." },
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
