const express = require('express');
const Posts = require('./postDb');

const router = express.Router();

router.get('/', (req, res, next) => {
  Posts.get().then(posts => {
    res.status(200).json(posts)
  }).catch(next);
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res, next) => {
  Posts.remove(req.post.id).then(deleted => {
    res.status(200).json(res.post);
  }).catch(next);
});
/*
router.put('/:id', validatePostId, (req, res, next) => {
  const { text } = req.body;
  Posts.update(req.post.id, { text }).then(updated => {
    res.status(200).json({ ...req.post, text });
  }).catch(next);
});
*/
router.put('/:id', validatePostId, async (req, res, next) => {
  try {
    const { text } = req.body;
    const updated = await Posts.update(req.post.id, { text });
    res.status(200).json({ ...req.post, text });
  } catch (error) {
    next(error);
  }
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  Posts.getById(id).then(post => {
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(400).json({ message: "invalid post id" });
    }
  }).catch(next);
};


router.use((error, req, res, next) => {
  res.status(500).json({
    file: 'postRouter',
    method: req.method,
    url: req.url,
    message: error.message
  });
});

module.exports = router;