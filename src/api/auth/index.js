const Router = require('koa-router');
const authCtrl = require('./auth.ctrl');

const route = new Router();

route.get('/complete', authCtrl.complete);
route.get('/google', authCtrl.auth_google);
route.get('/google/callback', authCtrl.auth_google_callback);
route.get('/userinfo', authCtrl.userInfo);
route.get('/check', authCtrl.check);
route.get('/logout', authCtrl.logout);

module.exports = route;