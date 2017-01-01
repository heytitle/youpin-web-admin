import pathlib from 'path';
import createError from 'http-errors';
import auth, { reset_user, cookie_auth_name } from '../middleware/auth';
import agent from '../agent';
import conf from '../config';
import log from '../logger';
import api from '../api';
import util from '../util';

// setup
const router = require('express').Router(); // eslint-disable-line
module.exports = router;

router.get('/', auth, (req, res, next) => {
  res.render('dashboard');
});

router.get('/login', (req, res, next) => {
  res.locals.success_url = util.site_url('/auth/success');
  res.locals.failure_url = util.site_url('/auth/failure');
  res.render('login');
});

router.get('/logout', (req, res, next) => {
  reset_user(req, res);
  res.redirect('/login');
});

router.get('/auth/success', (req, res, next) => {
  if (req.query.token) {
    res.cookie(cookie_auth_name, req.query.token, conf.get('service.cookie'));
  } else {
    log.error('No token found.');
  }
  res.redirect('/');
});

router.get('/auth/failure', (req, res, next) => {
  res.send('Something went wrong. Try again.');
});

function getPins() {
  return api('/pins');
}

router.get('/issue', auth, (req, res, next) => {
  // getPins()
  req.api('/pins')
  .then(result => {
    res.locals.pins = result.data || [];
    res.render('issue');
  })
  .catch(err => {
    next(err);
  });
});

router.get('/test', auth, (req, res, next) => {
  res.render('test');
});

router.get('/settings/department', auth, (req, res, next) => {
  res.render('settings/department');
});

router.get('/settings/user', auth, (req, res, next) => {
  res.render('settings/user');
});


// all other methods, show not found page
router.all('/*', auth, (req, res, next) => {
  next(createError(404));
});
