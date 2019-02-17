const passport = require('koa-passport');

//========== 구글 로그인
exports.auth_google = passport.authenticate('google');

//========== 구글 콜백
exports.auth_google_callback = passport.authenticate('google', {
   successRedirect: '/api/auth/complete',
   failureRedirect: '/'
});

//========== 유저 가입
exports.joinUser =  (ctx, profile)=>{
   const User = require('models/user');
   const {email, strategyId,strategy, nickname, ip} = profile;

   return new Promise( async (resolve, reject)=>{
      const userInfo = await User.findOne({email: email});
      ctx.session.user = {
         email: userInfo.email, 
         strategy: userInfo.strategy, 
         nickname: userInfo.nickname, 
         _id: userInfo._id
      };
      //해당 유저가 존재할 경우
      if(userInfo){
         return  resolve(ctx.session.user);
      }
      //해당 유저가 존재하지 않을 경우 가입 처리
      const user = new User({
         ...ctx.session.user,
         joinIp: ip
      });
      //mongodb 저장.
      await user.save();
      //promise 성공 반환
      return resolve({
         email, strategy, nickname, _id: user._id
      });
   });
};

//========== 유저 정보
exports.userInfo = ctx=>{
   if(!ctx.session.user){
      return ctx.status = 204;
   }
   ctx.body =  ctx.session.user;
};

//========== 로그인 유무 확인
exports.check = (ctx)=>{
   ctx.body = {
      logged: ctx.isAuthenticated()
   };
};

//========== 로그아웃
exports.logout = async (ctx)=>{
   ctx.session = null;
   await ctx.logout();
   ctx.status = 204;
};

//========== 로그인 완료시
exports.complete = ctx=>{
   ctx.body = `<script>
      window.opener.postMessage('login', "*");
      window.close();
   </script>`;
};