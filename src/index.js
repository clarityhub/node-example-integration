const express = require('express');
const bodyParser = require('body-parser');

const checkTokenMiddleware = require('./checkTokenMiddleware');
const { handleOauth, handleCallback } = require('./controllers');

const port = process.env.PORT || 3000;

const app = express();
const router = express.Router();

router.route('/oauth')
  .get(handleOauth);
router.route('/callback')
  .post(checkTokenMiddleware, handleCallback);

app.enable('trust proxy');
app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () => console.log(`Running on ${port}`));
