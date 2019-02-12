const Router = require('koa-router');

const route = new Router();
const authCtrl = require('./auth.ctrl');

route.get('/google', authCtrl.auth_google);
route.get('/google/callback', authCtrl.auth_google_callback);
route.get('/check', authCtrl.check);
route.get('/logout', authCtrl.logout);

module.exports = route;