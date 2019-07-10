const express = require('express');
const server = express();
const userRouter = require('./posts/postRouter');
const postRouter = require('./users/userRouter');

server.use(express.json())
server.use(logger)
server.use('/api/users', userRouter)
server.use('/api/posts', postRouter)


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {

};

module.exports = server;
