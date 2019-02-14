const Router = require('koa-router');
const toDosCtrl = require('./toDos.ctrl');
const tools = require('lib/tools');

const route = new Router();



route.post('/', 
   // tools.checkLogin,
   toDosCtrl.write);

route.get('/:id', 
   // categoryCtrl.checkLogin,
   tools.checkObjectId, 
   toDosCtrl.list
   );

route.patch('/:id', 
   // categoryCtrl.checkLogin, 
   tools.checkObjectId, 
   toDosCtrl.update);

route.delete('/:id',
   // categoryCtrl.checkLogin,
   tools.checkObjectId,
   toDosCtrl.remove);



module.exports = route;