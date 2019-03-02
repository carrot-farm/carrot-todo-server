//============ request 객체를 기반으로 아이피를 반환한다.
exports.getIp = (req)=>{
   const ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   req.connection.socket.remoteAddress
   ;
   return ip.split(':').pop();
};

//======= objectId 검증 미들웨어
exports.checkObjectId = (ctx, next)=>{
   const { ObjectId } = require('mongoose').Types;
   const {id} = ctx.params;
   if(!ObjectId.isValid(id)){
      ctx.status=400;
      return null;
   }
   return next();
};

//======= 로그인 확인 미들웨어
exports.checkLogin = (ctx, next)=>{
   // console.log('checkLogin',ctx.session.user);
   if(!ctx.session.user){
      ctx.status = 401;
      return null;
   }
   return next();
};

//======= 유효성 검증
exports.joiValidate = (ctx, schema)=>{
   const Joi = require('joi');
   const result = Joi.validate(ctx.request.body, schema);
   if(result.error){
      ctx.status = 400;
      ctx.body = result.error;
      return false;
   }
   return true;
};

//======= mongodb의 타입이 UTC로 고정되어 있어서 한국시간대로 맞추기
exports.setKST = ()=>{
   return new Date().getTime()+(3600000*9)
};