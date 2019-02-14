const Router = require('koa-router');
const auth = require('./auth');
const category = require('./category');
const toDos = require('./toDos');

const api = new Router();

api.use('/auth', auth.routes());
api.use('/category', category.routes());
api.use('/toDos', toDos.routes());

api.get('/test', (ctx)=>{
   ctx.body = 'test 성공: '+JSON.stringify(ctx.session.user);
});




module.exports = api;
