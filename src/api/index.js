const Router = require('koa-router');
const auth = require('./auth');

const api = new Router();

api.use('/auth', auth.routes());

api.get('/test', (ctx)=>{
   // ctx.session = {test: 'sdd'};
   ctx.body = 'test 성공: '+JSON.stringify(ctx.session.user);
});




module.exports = api;
