const ClarityHub = require('node-clarity-hub');

/**
 * We are using this object as a in-memory "database"
 * for simplicity. In a real integration, you will want
 * to store your access tokens and public keys in a secure
 * warehouse and treat them as passwords.
 */
const authorizations = {};

/**
 * If a client types "hoot" in their message, we will reply
 * with a picture of an owl
 */
const onEvent = ({ accountId, event }) => {
  const { chatUuid, text, participantType } = event;

  if (participantType === 'client') {
    const parts = text.split(' ');
    if (parts.indexOf('hoot') !== -1) {
      const clarityHub = new ClarityHub({
        accessToken: authorizations[accountId].accessToken,
      });

      // TODO only post if there is a user participant in the room
      // Or just post as the bot once we get bot accounts
      clarityHub.chatMessages.create({
        chatUuid,
        text: '![Owl](https://upload.wikimedia.org/wikipedia/commons/3/39/Athene_noctua_%28cropped%29.jpg)'
      })
    }
  }
};

/**
 * Users can revoke integrations at any point. We will let
 * you know when an account revokes your integration through
 * your callback endpoint if you specify one.
 */
const onOauthRevoked = async ({ event }) => {
  const { accessToken, accountId } = event;

  delete authorizations[accountId];
};

/**
 * When you register an integration and set up a callback url,
 * we first want to make sure that you own that url and make you
 * perform a simple handshake.
 * 
 * We give you a token that you should check, and then you send
 * us back the challenge we gave you.
 */
const onVerify = ({ token, challenge }, res) => {
  if (token === process.env.TOKEN) {
    res.status(200).send({
      challenge,
    });
  } else {
    res.status(403).send({
      reason: 'Invalid token',
    });
  }
}

/**
 * When a user clicks "Authorize" on your integration, we will
 * redirect the user to the Redirect URI that you specified with
 * a query string with a "code" in it. Use this code to get an
 * access token and public key for that account.
 * 
 * The access token is used to hit the API with privlidges as that
 * account.
 * 
 * The public key is used to hit our public API that "clients" can
 * hit. You can read more about this on our documentation website.
 */
const handleOauth = async (req, res) => {
  const {
    code,
  } = req.query;

  try {
    const clarityHub = new ClarityHub({});
  
    const response = await clarityHub.oauth.activate({
      code,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    authorizations[response.accountId] = {
      accessToken: response.accessToken,
      publicKey: response.publicKey,
    };

    res.status(200).send('Successfully activated!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something bad happened');
  }
};

/**
 * We send 3 major types of callbacks:
 * - url_verification – this is used when you wish to change your callback url
 * - event_callback – this occurs when an event you have subscribed to occurs
 * – oauth_callback – this only happens when a user revokes access to your integration 
 */
const handleCallback = (req, res) => {
  const { type, eventType } = req.body;

  if (type === 'url_verification') {
    onVerify(req.body, res);
  } else if (type === 'event_callback' && eventType === 'chat-message.created') {
    onEvent(req.body);
  } else if (type === 'oauth_callback' && eventType === 'integration.revoked') {
    onOauthRevoked(req.body);
  }

  res.status(200).send();
};

module.exports = {
  handleCallback,
  handleOauth,
};
