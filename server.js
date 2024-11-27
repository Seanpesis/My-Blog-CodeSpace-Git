const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model('Post', postSchema);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/posts', (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(posts);
    }
  });
});

app.post('/api/posts', (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  newPost.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send('Post added successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});