const Joi = require('joi');
const ToDos = require('models/toDos');
const tools = require('lib/tools');

//======= POST /api/toDos/
exports.write = async ctx => {
   try {
      const {_id:_userId} = ctx.session.user;
      const data = ctx.request.body;
      const schema = Joi.object().keys({
         content: Joi.string().required(),
         categoryId: Joi.string().required(),
      });
      //유효성 검증
      const result = Joi.validate(data, schema);
      if(result.error){
         ctx.status = 400;
         ctx.body = result.error;
         return;
      }
      //입력 객체 생성
      const toDos = new ToDos({
         _categoryId: data.categoryId,
         _userId: _userId,
         content: data.content,
         writeTime: tools.setKST()
      });
      await toDos.save();
      ctx.body = {
         _id: toDos._id,
         _categoryId: toDos._categoryId,
         _userId: toDos._userId,
         content: toDos.content,
         completed: toDos.completed,
         writeTime: toDos.writeTime
      };
   } catch (e) {
      ctx.throw(e, 500);
   }
};

//======= GET /api/toDos/toDo/:itemId
exports.read = async ctx=>{
   const {_id: _userId} = ctx.session.user;
   const { itemId} = ctx.params;
   const query = {   _userId: _userId, 
                     _id: itemId, 
                  };
   try {
      const item = await ToDos.findOne(query)
                              .select('completed content writeTime completeTime _id _categoryId _userId')
                              .lean()
                              .exec();
      //마지막 페이지를 헤더에 알려주기.
      ctx.body = item;
   } catch (e) {
      ctx.throw(e, 500);
   }
};

//======= GET /api/toDos/:categoryId?search=value&completed=true
exports.list = async ctx => {
   const {_id: _userId} = ctx.session.user;
   const { categoryId:_categoryId } = ctx.params;
   const completed = (ctx.query.completed==='true')?true:false;
   const page = Number(ctx.query.page||1);
   const listNum = 5;
   const query = { 
                     _userId: _userId, 
                     _categoryId: _categoryId, 
                     // completed: completed,
                  };
   try {
      const list = await ToDos.find(query)
                              .sort({ _id: -1 })//_id 필드 역정렬
                              .limit(listNum) //지정된 갯수 만큼 가져오기.
                              .skip((page-1)*listNum) //
                              .select('completed content writeTime completeTime _id _categoryId _userId')
                              .lean()
                              .exec();
      const totalNum = await ToDos.find(query).count().exec();
      //마지막 페이지를 헤더에 알려주기.
      ctx.set('Last-Page', Math.ceil(totalNum/listNum));
      ctx.body = list;
   } catch (e) {
      ctx.throw(e, 500);
   }
};

//======= PATCH /api/toDos/:itemId
exports.update = async ctx => {
   const { itemId } = ctx.params;
   const {_id: userId} = ctx.session.user;
   const query = {_id: itemId, _userId: userId};
   const schema = Joi.object().keys({
      content: Joi.string().required(),
      completed: Joi.boolean().required(),
   });
   //유효성 검증
   if(!tools.joiValidate(ctx, schema)){ 
      return; 
   }
   if(ctx.request.body.completed){
      ctx.request.body.completeTime = tools.setKST();
   }else{
      ctx.request.body.completeTime = null;
   }
   try {
      const item = await ToDos.findByIdAndUpdate(query, ctx.request.body, {
         new: true
      }).exec();
      if (!item) {
         ctx.status = 404;
         return;
      }
      ctx.body = item;
   } catch (e) {
      ctx.throw(e, 500);
   }
};

//======= DELETE /api/toDos/:itemId
exports.remove = async ctx => {
   const { itemId } = ctx.params;
   const {_id: userId} = ctx.session.user;
   const query = {_id: itemId, _userId: userId}
   console.log(query)
   try {
      await ToDos.findByIdAndRemove(query).exec();
      ctx.body = {_id: itemId};
   } catch (e) {
      ctx.throw(e, 500);
   }
};