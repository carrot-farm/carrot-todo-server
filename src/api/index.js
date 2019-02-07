const Router = require('koa-router');
const auth = require('./auth');

const api = new Router();

api.use('/auth', auth.routes());

api.get('/test', (ctx)=>{
   ctx.session.val = 'set value';
   console.log(ctx.session.val);
   ctx.body = 'test 성공';
});

module.exports = api;
