require('dotenv').config();//.env 파일에 정의되어 있는 설정 적용
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const session = require('koa-session');

//env 호출
const {
   PORT: port=4000, //값이 존재하지 않는다면 4000을 기본값으로 사용
   MONGO_URI: mongoURI,
   COOKIE_SIGN_KEY: signKey //.env에 설정되어 있는 키
} = process.env;
//mongodb 연결
const connection = require('./lib/mongo_connect').connect(mongoURI);

const app = new Koa();
const router = new Router();

const api = require('./api');

//라우터 설정
router.use('/api', api.routes());//api 라우트 적용

// 404 에러 처리
app.use(async (ctx, next)=>{
   try{
      await next();
      if(ctx.status === 404){
         ctx.body = '페이지를 찾을 수 없습니다.';
      }
   }catch(e){
      console.log(e);
   }
})



//라우터 적용전 bodyParser적용
app.use(bodyParser());

//세션적용
app.use(session({
   maxAge: 86400000,
}, app));

//세션키 적용
app.keys = [signKey];

//passport
const passport = require('api/auth/passport')(app);

//app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => {
   console.log('listen to port ', port);
});



