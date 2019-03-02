const Router = require('koa-router');
const toDosCtrl = require('./toDos.ctrl');
const tools = require('lib/tools');

const route = new Router();

//할일 작성
route.post('/', 
   tools.checkLogin,
   toDosCtrl.write);

//리스트 및 아이템 정보 가져오기.
route.get('/:categoryId', 
   tools.checkLogin,
   toDosCtrl.list
);

//아이템 정보 가져오기.
route.get('/toDo/:itemId',
   tools.checkLogin, 
   toDosCtrl.read
)

//아이템 업데이트
route.patch('/:itemId', 
   tools.checkLogin, 
   toDosCtrl.update);

// 아이템 삭제
route.delete('/:itemId',
   tools.checkLogin,
   toDosCtrl.remove
);



module.exports = route;