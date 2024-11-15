const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
const port = 1337;

app.use(express.urlencoded({ extended: true }));


app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  //Future scope: Basically I need to be able to handle when a user inputs both an image and a screenshot

  user_message = req.body.Body //get the user's message from the request body
  console.log(user_message)
  twiml.message(user_message);

  res.type('text/xml').send(twiml.toString());
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
