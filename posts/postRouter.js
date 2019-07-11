const express = require('express');
const router = express.Router();
const Post = require('./postDb');


router.get('/', (req, res) => {
    Post.get()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to load posts.", err
      });
    });
});

router.get("/:id", validatePostId, async (req, res) => {
    Post.getById(req.params.id)
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).json({
          message: `Can't load post with ID: ${req.params.id}`
        });
      });
  });

router.delete('/:id',validatePostId, (req, res) => {
  Post.remove(req.params.id)
  .then(data => {
    res.status(200).json(data) 
  }).catch(error =>{
    res.status(500).json({
      message: `The id ${req.param.id} can't be removed`, error
    })
  })
});

router.put('/:id', validatePostId, (req, res) => {
  const id = req.params.id
  const newUser = req.body;

  Post.update(id, newUser)
  .then(count => {
    res.status(200).json(newUser)
  }).catch(error =>{
    res.status(500).json({
      error: "Post could not be updated", error
    })
  })
});

// custom middleware

async function validatePostId(req, res, next) {
    const post = await Post.getById(req.params.id);
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(400).json({ message: "Invalid post ID" });
    }
  }

module.exports = router;