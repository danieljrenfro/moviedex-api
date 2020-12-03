require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const movieData = require('./movieData.json');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(helmet());
app.use(cors());
app.use(morgan(morganSetting));

function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization') || '';

  if (!authToken) {
    return res.status(400).send('Request must have Bearer token');
  }

  if (authToken.split(' ')[1] !== apiToken) {
    return res.status(401).send('Invalid credentials');
  }
  next();
}

app.use(validateBearerToken);

function handleGetMovies(req, res) {
  const { genre, country, avg_vote } = req.query;
  let response = movieData;
  let numericAvgVote = Number(avg_vote);

  if (avg_vote && !numericAvgVote) {
    return res.status(400).send('Average vote must be a number');
  } else if (avg_vote && numericAvgVote) {
    response = response.filter(movie => movie.avg_vote >= numericAvgVote);
  }

  if (genre === '' || genre === ' ') {
    return res.status(400).send('There must be characters in genre query');
  } else if (genre) {
    response = response.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if (country === '' || country === ' ') {
    return res.status(400).send('There must be characters in country field');
  } else if (country) {
    response = response.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
  }



  res.json(response);
}

app.get('/movie', handleGetMovies);

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'Server Error' } };
  } else {
    response = { error };
  }
  res
    .status(500)
    .json(response);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT);