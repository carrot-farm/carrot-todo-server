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
   const {email, strategyId, strategy, nickname, ip} = profile;

   return new Promise( async (resolve, reject)=>{
      try{
         const userInfo = await User.findOne({email: email});
         // 해당 유저가 존재할 경우
         if(userInfo){
            return  resolve({
               email: userInfo.email,
               strategy: userInfo.strategy,
               nickname: userInfo.nickname,
               _id: userInfo._id,
            });
         }
         // 해당 유저가 존재하지 않을 경우 가입 처리
         const user = new User({
            email: email,
            strategy: strategy,
            nickname: nickname,
            joinIp: ip,
         });
         await user.save();
         //promise 성공 반환
         return resolve({
            email, strategy, nickname, _id: user._id
         });

      }catch(e){
         reject(e);
      }
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

//=========== 접속 시 초기 데이터
exports.initialData = async ctx=>{
   const logged = ctx.isAuthenticated();
   const mongoose = require('mongoose');
   const {User} = mongoose.models;
   try{
      if(logged){
         const {_id: userId} = ctx.session.user;
         const user = await User.findById(userId).select('_selectedCategory -_id').exec();
         const data = {
            logged: logged,
            _selectedCategory: (user._selectedCategory)?user._selectedCategory:''
         };
         return ctx.body = data;
      }
      ctx.body = {logged: logged};
   }catch(e){
      ctx.throw(e, 500);
   }
}

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