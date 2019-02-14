const Joi = require('joi');
const ToDos = require('models/toDos');
const tools = require('lib/tools');

//======= POST /api/toDos/
exports.write = async ctx => {
   try {
      // const {_id:_userId} = ctx.session.user;
      const  _userId  = '5c62f30b788f3c32f84c1a2e';
      const data = ctx.request.body;
      const schema = Joi.object().keys({
         _categoryId: Joi.string().required(),
         content: Joi.string().required(),
         tags: Joi.array().items(Joi.string()),
      });
      //유효성 검증
      if (tools.joiValidate(ctx, schema) === false) {
         return;
      }
      //입력 객체 생성
      const toDos = new ToDos({
         _categoryId: data._categoryId,
         _userId: _userId,
         content: data.content,
         tags: data.tags
      });
      await toDos.save();
      ctx.body = toDos;
   } catch (e) {
      ctx.throw(e, 500);
   }
};

//======= GET /api/toDos/:id(categoryId)
exports.list = async ctx => {
   // const {_id} = ctx.session.user;
   // const query = {_id:_id}
   const { id:_categoryId } = ctx.params;
   const query = { _userId: '5c62f30b788f3c32f84c1a2e', _categoryId: _categoryId};
   try {
      const categories = await ToDos.find(query)
         .sort({ _id: -1 })
         .lean()
         .exec();
      ctx.body = categories;
   } catch (e) {
      ctx.throw(e, 500);
   }
};

//======= PATCH /api/toDos/:id
exports.update = async ctx => {
   const { id } = ctx.params;
   // const {_id: userId} = ctx.session.user;
   // const query = {_id: id, _userId: userId};
   const query = { _id: id, _userId: '5c63fb2fea62d035288117bf' };
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

//======= DELETE /api/toDos/:id
exports.remove = async ctx => {
   const { id } = ctx.params;
   // const {_id: _userId} = ctx.session.user;
   const query = { _id: id, _userId: '5c63fb2fea62d035288117bf' };
   try {
      await ToDos.findByIdAndRemove(query).exec();
      ctx.status = 204;
   } catch (e) {
      ctx.throw(e, 500);
   }
};