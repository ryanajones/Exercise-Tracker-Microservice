/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const uniqid = require('uniqid');
const e = require('express');

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
  log: [
    {
      description: String,
      duration: String,
      date: String,
    },
  ],
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
    if (findOne) {
      res.json({
        error: 'Username already used',
      });
    } else {
      findOne = new ExerciseRecords({ username });
      await findOne.save();
      res.json({
        username: findOne.username,
        id: findOne._id,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// Response to add exercises POST
app.post('/api/exercise/add', async (req, res) => {
  const { userId, description, duration, date } = req.body;

  // Handle date here
  let modifiedDate;
  if (date) {
    modifiedDate = new Date().toDateString(date);
  } else {
    modifiedDate = new Date().toDateString();
  }

  const log = {
    description,
    duration,
    date: modifiedDate,
  };

  try {
    const findOne = await ExerciseRecords.findOne({
      _id: userId,
    });
    if (findOne) {
      ExerciseRecords.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            log,
          },
        },
        { new: true },
        (err) => {
          if (err) return console.log(err);
        }
      );
      const { username } = findOne;
      res.json({
        userId,
        username,
        description,
        duration,
        date: modifiedDate,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json('Server error..');
  }
});

app.get('/api/exercise/users', async (req, res) => {
  try {
    const allUsers = await ExerciseRecords.find({});
    const userNameAndId = allUsers.map((el) => ({
      username: el.username,
      _id: el._id,
    }));
    res.json(userNameAndId);
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/exercise/log?', async (req, res) => {
  const userParam = req.params.userId;
  try {
    console.log(req.query);
  } catch (err) {
    console.log(err);
  }
});

// Listens for connections
app.listen(port, function () {
  console.log('Node.js listening ...');
});
