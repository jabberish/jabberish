require('dotenv').config();
require('./lib/utils/connect')();

const http = require('./lib/app');

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});
