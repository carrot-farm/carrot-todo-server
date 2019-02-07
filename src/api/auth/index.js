const Router = require('koa-router');

const auth = new Router();
const authCtrl = require('./auth.ctrl');

auth.get('/auth/google', authCtrl.auth_google);
auth.get('/auth/google/callback', authCtrl.auth_google_callback);
// auth.post('/login', authCtrl.login);
// auth.get('/check', authCtrl.check);
// auth.post('/logout', authCtrl.logout);

module.exports = auth;