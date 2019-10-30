const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const server = express();

server.use(helmet());
server.use(logger);
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware
function logger(req, res, next) {
  console.log(req.method, req.url, Date.now())
};

module.exports = server;
