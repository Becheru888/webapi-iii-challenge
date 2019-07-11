const express = require('express');
const Users = require('./userDb')
const router = express.Router();

router.post('/', (req, res) => {

});

router.post('/:id/posts', (req, res) => {

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

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

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

};

function validatePost(req, res, next) {

};

module.exports = router;
