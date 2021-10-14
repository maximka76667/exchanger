const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { getExchanges, addExchange, deleteExchange } = require('../exchanges/exchange-controller');
const {
  createUser, login, getMyUser, updateUser, signout,
} = require('../users/user-controller');
const { validateLink } = require('../utils/validateLink');
const routeNotFound = require('../middlewares/route-not-found');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.use(auth);

// Exchanges routes
router.get('/exchanges', getExchanges);

router.post(
  '/exchanges',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(validateLink),
      trailer: Joi.string().required().custom(validateLink),
      thumbnail: Joi.string().required().custom(validateLink),
      exchangeId: Joi.number().integer().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  addExchange,
);

router.delete(
  '/exchanges/:exchangeId',
  celebrate({
    params: Joi.object().keys({
      exchangeId: Joi.string().hex().length(24),
    }),
  }),
  deleteExchange,
);

// Users routes
router.get('/users/me', getMyUser);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
    }),
  }),
  updateUser,
);

router.get('/signout', signout);

router.use(routeNotFound);

module.exports = router;