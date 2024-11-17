import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from "@langchain/openai";

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
}

// Example usage
const imageUrls = [
  "https://www.boredpanda.com/blog/wp-content/uploads/2022/02/clipimage-62036e125f6e3__700.jpg",
  "https://cdn.osxdaily.com/wp-content/uploads/2018/08/save-iphone-messages-screenshot-method-2-369x800.jpeg",
  "https://cdn.osxdaily.com/wp-content/uploads/2018/08/save-iphone-messages-screenshot-method-2-369x800.jpeg",
  // Add more URLs if needed
];
processImages(imageUrls).catch(console.error);
