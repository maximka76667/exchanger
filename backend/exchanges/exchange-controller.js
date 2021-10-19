const Movie = require('./exchange');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const { errorMessages } = require('../errors/error-config');
const handleErrors = require('../errors/handle-errors');

const notFoundErrorMessage = errorMessages.notFoundErrorMessages.movies;
const { forbiddenErrorMessage } = errorMessages;

const getExchanges = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ movies: movies.reverse() }))
    .catch((err) => next(handleErrors(err)));
};

const addExchange = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => res.send({ movie }))
    .catch((err) => next(handleErrors(err)));
};

const deleteExchange = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError(notFoundErrorMessage);
      if (movie.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenErrorMessage);
      }
      Movie.findByIdAndDelete(movieId)
        .then(() => res.send({ movie }))
        .catch((err) => next(handleErrors(err)));
    })
    .catch((err) => next(handleErrors(err)));
};

module.exports = {
  getExchanges,
  addExchange,
  deleteExchange
}