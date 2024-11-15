import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from "@langchain/openai";

async function processImage() {
  const imageUrl = "https://www.boredpanda.com/blog/wp-content/uploads/2022/02/clipimage-62036e125f6e3__700.jpg";
  const imageData = await fetch(imageUrl).then(res => res.arrayBuffer());
  const base64Image = Buffer.from(imageData).toString('base64');
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  });

  const message = new HumanMessage({
    content: [
      { type: "text", text: "You are an AI dating coach. You are given an image of a conversation where the rightmost text is me. Propose three followup messages(no emojis)." },
      {
        type: "image_url",
        image_url: { url: `data:image/jpeg;base64,${base64Image}` },
      },
    ]
  });

  const imageDescriptionAiMsg = await llm.invoke([message]);
  console.log(imageDescriptionAiMsg.content);
}

// Call the async function
processImage().catch(console.error);
