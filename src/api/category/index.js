const Router = require('koa-router');
const categoryCtrl = require('./category.ctrl');
const tools  = require('lib/tools');

const route = new Router();

route.get('/', 
   // tools.checkLogin,
   categoryCtrl.list
   );

route.post('/', 
   // tools.checkLogin,
   categoryCtrl.write);

route.patch('/:id', 
   // tools.checkLogin, 
   tools.checkObjectId, 
   categoryCtrl.update
   );

route.delete('/:id',
   // tools.checkLogin,
   tools.checkObjectId,
   categoryCtrl.remove);



module.exports = route;