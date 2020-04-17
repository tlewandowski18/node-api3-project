const express = require('express');
const userDb = require('./userDb')
const postDb = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser(), async (req, res, next) => {
  // do your magic!
  try {
    const newUser = await userDb.insert(req.body)
    res.status(201).json(newUser)
  } catch(err) {
    next(err)
  }

});

router.post('/:id/posts', validatePost(), validateUserId(), async (req, res, next) => {
  try {
    const newPost = await postDb.insert(req.body)
    res.status(201).json(newPost)
  } catch(err) {
    next(err)
  }
});

router.get('/', async (req, res, next) => {
  try {
    const users = await userDb.get() 
    res.json(users)
  } catch(err) {
    next(err)
  }
});

router.get('/:id', validateUserId(), (req, res) => {
  res.json(req.user)
});

router.get('/:id/posts', validateUserId(), async (req, res, next) => {
  try {
    const posts = await postDb.get()
    res.json(posts)
  } catch(err) {
    next(err)
  }
});

router.delete('/:id', validateUserId(), async (req, res, next) => {
  try {
    await userDb.remove(req.params.id)
    res.status(204).end()
  } catch(err) {
    next(err)
  }
});

router.put('/:id', validateUser(), validateUserId(), async (req, res, next) => {
  try {
    await userDb.update(req.params.id, req.body)
    res.status(200).end()
  } catch(err) {
    next(err)
  }
});

//custom middleware

function validateUserId() {
  // do your magic!
  return async (req, res, next) => {
    try {
      const user = await userDb.getById(req.params.id)
      if (user) {
        req.user = user
        next()
      } else {
        res.status(404).json({
          message: "Could not find user",
        })
      }
    } catch (err) {
      next(err)
    }
  }
}

function validateUser() {
  return (req, res, next) => {
    if (!req.body) {
      res.status(400).json({ message: "missing user data" })
    } else if (!req.body.name) {
      res.status(400).json({ message: "missing required name field" })
    }
    next()
  }
}


function validatePost(req, res, next) {
  return (req, res, next) => {
    if (!req.body) {
      res.status(400).json({ message: "missing post data" })
    } else if (!req.body.text) {
      res.status(400).json({ message: "missing required text field" })
    }
    next()
  }
}

module.exports = router;
