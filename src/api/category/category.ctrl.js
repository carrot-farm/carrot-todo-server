const Joi = require('joi');
const Category = require('models/Category');

//======= GET /api/category/:id
exports.read = async (ctx)=>{
   const {id} = ctx.params;
   try{
      const category = await Category.findById(id).select('_id category').exec();
      if(!category){
         ctx.status = 404;
         return;
      }
      ctx.body = category;
   }catch(e){
      ctx.throw(e, 500);
   }
};

//======= GET /api/category/
exports.list = async ctx=>{
   const {_id} = ctx.session.user;
   const page = Number(ctx.query.page||1);
   const query = {_userId:_id};
   const listNum = 20;
   try{
      const categories = await Category.find(query)
         .sort({_id: -1})
         .limit(listNum)
         .skip((page-1)*listNum)
         .select('_id category')
         .lean()
         .exec();
      const totalNum = await Category.find(query).count().exec();
      //마지막 페이지를 헤더에 알려주기.
      ctx.set('Last-Page', Math.ceil(totalNum/listNum));
      ctx.body = categories;
   }catch(e){
      ctx.throw(e, 500);
   }
};

//======= POST /api/category/
exports.write = async ctx=>{
   try{
      const {_id:_userId} = ctx.session.user;
      const schema = Joi.object().keys({
         category: Joi.string().required(),
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

//======= PATCH /api/category/:categoryId
exports.update = async ctx=>{
   const {id} = ctx.params;
   const {_id: userId} = ctx.session.user;
   const query = {_id: id, _userId: userId};
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
   const {_id: userId} = ctx.session.user;
   const query = {_id: id, _userId: userId};
   try{
      await Category.findByIdAndRemove(query).exec();
      ctx.body = {id: id};
   }catch(e){
      ctx.throw(e, 500);
   }
};

//카테고리 선택
//======= patch /api/category/select/:id
exports.selectCategory = async ctx=>{
   const mongoose = require('mongoose');   
   const {User} = mongoose.models;
   const {id:categoryId} = ctx.params;
   const {_id: userId} = ctx.session.user;
   const query = {_id:userId};
   const data = {
      _selectedCategory: categoryId
   }
   try{
      const user = await User.findByIdAndUpdate(query, data).exec();
      if(!user){
         ctx.status = 404;
         return;
      }
      ctx.body = data._selectedCategory;
   }catch(e){
      ctx.throw(e, 500)
   }
};