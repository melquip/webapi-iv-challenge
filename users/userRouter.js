const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, validatePost, (req, res, next) => {
  Users.insert({ name: req.body.name }).then(user => {
    res.status(200).json(user);
  }).catch(next);
});

router.post('/:id/posts', validateUserId, (req, res, next) => {
  Posts.insert({ text: req.body.text, user_id: req.user.id }).then(post => {
    res.status(200).json(post);
  }).catch(next);
});

router.get('/', (req, res, next) => {
  Users.get().then(userList => {
    res.status(200).json(userList);
  }).catch(next);
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {

});

router.delete('/:id', validateUserId, (req, res) => {

});

router.put('/:id', validateUserId, (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.getById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  }).catch(next);
};

function validateUser(req, res, next) {
  if (Object.keys(req.body).length) {
    const { name } = req.body;
    if (name) {
      next();
    } else {
      res.status(400).json({ message: "missing required name field" });
    }
  } else {
    res.status(400).json({ message: "missing user data" });
  }
};

function validatePost(req, res, next) {
  if (Object.keys(req.body).length) {
    const { text } = req.body;
    if (text) {
      next();
    } else {
      res.status(400).json({ message: "missing required text field" });
    }
  } else {
    res.status(400).json({ message: "missing post data" });
  }
};

module.exports = router;
