require('dotenv').config();
const server = require('./server');
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log('Listening at port', port);
})