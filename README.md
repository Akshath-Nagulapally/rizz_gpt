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

ngrok http 3000

twilio phone-numbers:update "your twilio number" --sms-url="ngrok-url-from-last-step"

Twilio configuration needs to be updated based on this issue error: 
NOTE: Make sure you add "/sms" to the end of the ngrok url that you update in Twilio.


twilio phone-numbers:update "+18332083674" --sms-url="https://3454-130-126-255-35.ngrok-free.app/sms"



Once you receive the confirmation step, you can then text your number (limited to verified numbers only if you are on the free trial).

Todos tomorrow:
1) Handling screenshot upload, what do I even do with them 
2) Turn Server.js into typescript
3) Langchain simple followup responses
4) Giving a friendly message if the filetype is not an image/video
5) Making the setup instructions look good
6) Adding good documentation for the code
7) Twilio MMS security. Basically anyone with the url can access the image. This should however be password protected in the future.
8) Enabling rate limiting for different different numbers
9) Match texting patterns
10) Identifying who is even talking here. Is it the user or the other person?
11) Match the overall "vibe" of the conversation. Is it friendly, flirty, etc?
12) Adding a database to store the conversation history and the user's information. This will allow us to have a more personalized experience for the user.
13) Making a google keyboard extension so that it can basically autocomplete it
14) Memory for the bot so that It can draw upon past requests the user made, this will allow users to make the other person say "omg I cant believe you remember that!" The only problem with this feature is that the bot needs to be able to classify who the person is in the screenshot otherwise it may give wrong details.
15) Memory would also help the user ask followup questions/refinements to the messages.
16) Not sure if twilio supports this but basically a widget or something that can do quick copypasting. Basically its kind of a pain to copypaste things so if there is a widget where I can simply click the line and copy to clipboard, that would be super useful.
17) Instead of a widget, I can also make twilio simply sequence the messages. This way the user just has to select which line he likes the most instead of the other way around.



















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