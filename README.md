# Node Example Integration
An example integration for Clarity Hub using Node.JS

## About this Integration

This example goes over creating an integration, using Oauth, setting up callbacks, and using the Clarity Hub npm package.

## Getting Started

1. Go to the [Developers Site](https://developers.clarityhub.io).
2. Sign in and create an integration. Give it the name "Hoot Bot"
3. Run ngrok `ngrok http 3000` and grab the `https` forwarding port. In our case, it is `https://c7faee32.ngrok.io`
3. In the Developers panel, grab your Client Id, Client Secret, and Verification token and run: `$ CLIENT_ID=XXX CLIENT_SECRET=XXX TOKEN=XXX PORT=3000 yarn start`
4. In the Developers panel, set your Callback Url to `https://c7faee32.ngrok.io/callback` and select the `chat-message.created` event. You should see success.
5. In the Developers panel, set your Redirect URI to `https://c7faee32.ngrok.io/oauth`. You should see success.

Let's test the integration!

1. Go to `https://app.clarityhub.io/oauth/authorize?clientId=XXX`
2. Click "Reactivate"
3. You should see "Successfully activated!"
4. Try it out. Create a chat as a client, join the room on the agent's end and then send the word "hoot" as the client. The integration should respond with a picture of an owl!

