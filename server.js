/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const uniqid = require('uniqid');

/* mongoose.Promise = global.Promise;
 */
const app = express();
const port = process.env.PORT || 5000;

// MongoDB and mongoose connect
process.env.MONGO_URI =
  'mongodb+srv://rjonesy91:Rjwowz!1991@fcc.zypnf.mongodb.net/fcc?retryWrites=true&w=majority';
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database schema
const exerciseRecordSchema = new mongoose.Schema({
  username: String,
  id: String,
  description: String,
  duration: String,
  date: String,
});

const ExerciseRecords = mongoose.model('exerciseRecord', exerciseRecordSchema);

// App middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function (req, res) {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

// Response to create new user POST
app.post('/api/exercise/new-user', async (req, res) => {
  const { username } = req.body;
  const uniqueID = uniqid();

  try {
    let findOne = await ExerciseRecords.findOne({
      username,
    });
    console.log(findOne);
    if (findOne) {
      res.json({
        error: 'Username already used',
      });
    } else {
      findOne = new ExerciseRecords({ username, id: uniqueID });
      await findOne.save();
    }
  } catch (err) {
    console.log(err);
  }
});

// Response to add exercises POST
app.post('/api/exercise/add', async (req, res) => {
  const { userId, description, duration, date } = req.body;
  try {
    let findOne = await ExerciseRecords.findOne({
      id: userId
    })

  }
});

// Redirect shortened URL to Original URL
app.get('/api/shorturl/:shortURL?', async (req, res) => {
  try {
    const urlParams = await URL.findOne({
      shortURL: req.params.shortURL,
    });
    if (urlParams) {
      return res.redirect(urlParams.originalURL);
    }
    return res.status(404).json('No URL found');
  } catch (err) {
    console.log(err);
    res.status(500).json('Server error..');
  }
});
// Listens for connections
app.listen(port, function () {
  console.log('Node.js listening ...');
});
