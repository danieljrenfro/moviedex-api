require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const movieData = require('./movieData.json')

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('common'));

app.listen(8000, () => console.log('Server is listening on port 8000'));