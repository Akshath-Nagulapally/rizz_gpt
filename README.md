# rizz-gpt

AI dating coach text message bot. The bot allows users to text a number and:

1. Upload screenshots of a dating profile. The bot should then present 3 possible pickup lines.
2. Upload dating app chats(through screenshot once again). The bot should then present 3 potential follow up lines.

Tech Stack:
1. Typescript, Express
2. Twilio API
3. LangGraph for agent control


Image goes through a node that checks if it is even valid.

If dating profile --> 3 possible pickup lines.
If dating app chat --> Transcription node --> 3 potential followup lines.

[Setup instructions]:














Questions:
1) Database integration?
2) Can I assume all images are valid, ie wont have to check for non rizz advice images?
3) Does this thing need memory?
4) Do I use SMS or do I use Whatsapp?
