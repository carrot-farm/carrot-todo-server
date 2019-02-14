const Joi = require('joi');
const Category = require('models/Category');
const { ObjectId } = require('mongoose').Types;

//======= GET /api/category/
exports.list = async ctx=>{
   // const {_id} = ctx.session.user;
   // const query = {_id:_id}
   const query = {_userId:'5c62f30b788f3c32f84c1a2e'};
   try{
      const categories = await Category.find(query)
         .sort({_id: -1})
         .lean()
         .exec();
      ctx.body = categories;
   }catch(e){
      ctx.throw(e, 500);
   }
};

//======= POST /api/category/
exports.write = async ctx=>{
   try{
      // const {_id:_userId} = ctx.session.user;
      const {_userId} = ctx.request.body;
      const schema = Joi.object().keys({
         category: Joi.string().required(),
         _userId: Joi.string().required()
     });
      //유효성 검증
      const result = Joi.validate(ctx.request.body, schema);
      if(result.error){
         ctx.status = 400;
         ctx.body = result.error;
         return;
      }
      //입력 객체 생성
      const category = new Category({
         category: ctx.request.body.category,
         _userId: _userId
      });
      await category.save();
      ctx.body = category;
   }catch(e){
      ctx.throw(e, 500);
   }
};

exports.test = (ctx)=>{
   console.log(ctx);
}
//======= PATCH /api/category/:categoryId
exports.update = async ctx=>{
   const {id} = ctx.params;
   // const {_id: userId} = ctx.session.user;
   // const query = {_id: categoryId, _userId: userId};
   const query = {_id: id, _userId: '5c62f30b788f3c32f84c1a2e'};
   try{
      const category = await Category.findByIdAndUpdate(query, ctx.request.body, {
         new: true
      }).exec();
      if(!category){
         ctx.status = 404;
         return;
      }
      ctx.body = category;
   }catch(e){
      ctx.throw(e, 500);
   }
};

//======= DELETE /api/category/:categoryId
exports.remove = async ctx=>{
   const {id} = ctx.params;
   // const {_id: userId} = ctx.session.user;
   // const query = {_id: categoryId, _userId: userId};
   const query = {_id: id, _userId: '5c63fb2fea62d035288117bf'};
   try{
      await Category.findByIdAndRemove(query).exec();
      ctx.status = 204;
   }catch(e){
      ctx.throw(e, 500);
   }
};