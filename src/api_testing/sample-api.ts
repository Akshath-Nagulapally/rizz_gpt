const express = require('express');
import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from "@langchain/openai";
import { Request, Response, NextFunction } from 'express';


const app = express();
const port = 5000;

async function processImages(imageUrls: string[]) {
  return imageUrls;
}

//processImages(imageUrls).catch(console.error);

app.post('/', async (req: Request, res: Response) => {
  try {

    const { imageUrls } = req.body;

    // Validate input
    if (!imageUrls || !Array.isArray(imageUrls)) {
      return res.status(400).send('Invalid input: `imageUrls` must be an array of strings.');
    }

    // Call the async function
    const processedData = await processImages(imageUrls);

    const data = await processImages(imageUrls); // Call the async function
    res.send(data);                   // Send the result
  } catch (error) {
    res.status(500).send('An error occurred'); // Handle errors
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
