# rizz-gpt

AI dating coach text message bot. The bot allows users to text a number and:

1. Upload screenshots of a dating profile. The bot should then present 3 possible pickup lines.
2. Upload dating app chats(through screenshot once again). The bot should then present 3 potential follow up lines.

Tech Stack:
1. Typescript, Express
2. Twilio API
3. LangGraph for agent control


Setup instructions:

follow instructions to install twilio cli: https://www.twilio.com/docs/messaging/quickstart/node#install-the-twilio-cli


git clone https://github.com/Akshath-Nagulapally/rizz-gpt.git

cd rizz-gpt/src

node server.js

ngrok http 1337

twilio phone-numbers:update "your twilio number" --sms-url="ngrok-url-from-last-step"

Once you receive the confirmation step, you can then text your number (limited to verified numbers only if you are on the free trial).

Todos tomorrow:
1) Handling screenshot upload, what do I even do with them 
2) Turn Server.js into typescript
3)  Langchain simple followup responses
4)  Giving a friendly message if the filetype is not an image/video
5) Making the setup instructions look good
6) Adding good documentation for the code



















Image goes through a node that checks if it is even valid.

If dating profile --> 3 possible pickup lines.
If dating app chat --> Transcription node --> 3 potential followup lines.

[Setup instructions]:














Questions:
1) Database integration?
2) Can I assume all images are valid, ie wont have to check for non rizz advice images?
3) Does this thing need memory?
4) Do I use SMS or do I use Whatsapp?
5) Input validation: If there are more than n number of screenshots passed where n is the limit.
6) JS to TS conversion