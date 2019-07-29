const express = require('express');
const cors = require('cors');
const app = express();

app.use(require('cookie-parser')());
app.use(express.json());
app.use(cors());

app.use(express.static('public'));

app.use('/api/v1/auth', require('./routes/auth'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
