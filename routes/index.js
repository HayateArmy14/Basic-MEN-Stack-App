const express = require('express');
const { authenticate } = require('passport');
const router = express.Router();
const {
   getRegister, 
   postRegister,
   getLogin,
   postLogin, 
   getLogout 
  } = require("../controllers/index")
const {asyncErrorHandler} = require("../middleware/index");
const { rawListeners } = require('../models/user');

/* GET home page. */
router.get('/', getRegister);

/* GET /register. */
router.get('/register', getRegister);

/* POST /register. */
router.post('/register',  asyncErrorHandler(postRegister));

/* GET /login. */
router.get('/login', getLogin);

/* POST /login. */
router.post('/login', asyncErrorHandler(postLogin));

//GET /logout
router.get("/logout", getLogout)

/* GET /profile. */
router.get('/profile', (req, res, next) => {
  res.send('POST /profile');
});

/* PUT /profile/:user_id */
router.put('/profile/:user_id', (req, res, next) => {
  res.send('PUT /profile/:user_id');
});

/* GET /forgot-password. */
router.get('/forgot', (req, res, next) => {
  res.send('GET /forgot');
});

/* PUT /forgot-password. */
router.put('/forgot', (req, res, next) => {
  res.send('PUT /forgot');
});

/* GET /reset-password. */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset/:token');
});

/* PUT /reset-password. */
router.put('/reset/:token', (req, res, next) => {
  res.send('PUT /reset/:token');
});

module.exports = router;
   