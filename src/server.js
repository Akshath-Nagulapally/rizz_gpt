const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));


app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  const mediaUrl = req.body.MediaUrl0; // Image URL (if any)
  const mediaType = req.body.MediaContentType0; // Media type (e.g., image/jpeg)
  const user_message = req.body.Body //get the user's message from the request body
  const images = [];

  //basically: If the user inputs only text, handle it by saying "sorry, i only accept screenshots", once image is there then invoke the same function thing.



  res.type('text/xml').send(twiml.toString());
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
