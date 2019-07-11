const express = require('express');
const Users = require('./userDb')
const Posts = require('../posts/postDb')
const router = express.Router();

router.post('/', validateUser, async(req, res) => {
    try{
        const name = req.body
        Users.insert(name)
        res.status(200).json({message:'User Created'})
    }catch(error){
        res.status(500).json({message: "Can't add any users"})
    }
});

router.post('/:id/posts',validateUser, validatePost, async (req, res) => {
    try{
        const newPost = {text: req.body.text, user_id: req.params.id};
        Posts.insert(newPost)
        res.status(201).json(newPost)
    }catch(error){
        res.status(500).json({message: "Add post revoked"})
    }
});

router.get('/', async (req, res) => {
    try{
       const users = await Users.get()
       res.status(200).json(users)
    }
    catch(error){
        res.status(500).json(error)
    }
});

router.get('/:id', validateUserId, (req, res) => {
    try{
        // the middleware after scrutiny injects a user property to the req
        // this req.user can now be accessed by this function block
        res.status(200).json(req.user)
    }catch(error){
        res.status(500).json(error)
    }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
    try{
        const posts = await Users.getUserPosts(req.user.id)
        res.status(200).json(posts)
    }catch(error){
        res.status(400).json(error)
    }
});

router.delete('/:id', validateUserId, async (req, res) => {
   try{
       const user = await Users.remove(req.user.id)
       res.status(200).json('User was succesfuly deleted')
    }catch(error){
        res.status(400).json(error)
    } 
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
    try {
        const updateUser = req.body
        const user = await Users.update(req.user.id, updateUser)
        res.status(200).json(user)
    }catch(error){
        res.status(400).json('Not available for update')
    }
});

//custom middleware

async function validateUserId(req, res, next) {
    // step 1: fish out the id from the req params and convert to a number
    const id = Number(req.params.id);
    // step 2: test if id is really a whole number
    if(Number.isInteger(id)) {
        // step 3: check if user with that id exists on the database
        const user = await Users.getById(id);
        // step 4: if user exists, append the user object to the request and proceed
        if (user) {
            req.user = user;
            next(); // you are cleared to proceed to the function!
        } else {
            res.status(404).json('Id not found');
        }
    } else {
        res.status(400).json('The id is not valid');
    }
};

function validateUser(req, res, next) {
    if (Object.keys(req.body) == 0) {
        res.status(400).json({
          message: "Missing user data."
        });
      } else if (req.body.name) {
        next();
      } else {
        res.status(400).json({
          message: "Missing required name field."
        });
      }
};

function validatePost(req, res, next) {
    if (Object.keys(req.body) == 0) {
        res.status(400).json({
          message: "Missing post data"
        });
      } else if (req.body.text) {
        next();
      } else {
        res.status(400).json({
          message: "Missing required text field"
        });
      }
};

module.exports = router;
