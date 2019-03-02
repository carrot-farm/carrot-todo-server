const Router = require('koa-router');
const categoryCtrl = require('./category.ctrl');
const tools  = require('lib/tools');

const route = new Router();

route.get('/', 
   tools.checkLogin,
   categoryCtrl.list
);

route.get('/:id', 
   tools.checkLogin,
   categoryCtrl.read
);

route.post('/', 
   tools.checkLogin,
   categoryCtrl.write
);

route.patch('/:id', 
   tools.checkLogin, 
   tools.checkObjectId, 
   categoryCtrl.update
);

route.delete('/:id',
   tools.checkLogin,
   tools.checkObjectId,
   categoryCtrl.remove
   );

// 카테고리 선택
route.patch('/select/:id',
   // tools.checkLogin,
   categoryCtrl.selectCategory,
)



module.exports = route;