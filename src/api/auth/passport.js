module.exports = (app) => {
   const {
      HOST: host,
      PORT: port,
      GOOGLE_CLIENT_ID: clientId,
      GOOGLE_SECRET: clientSecret
   } = process.env;
   const passport = require('koa-passport');
   app.use(passport.initialize());
   app.use(passport.session());

   //최초 접근시 id 저장
   passport.serializeUser(function (user, done) {
      console.log('serialize');
      done(null, user.email)
   });

   //서버 접근시 마다 저장된 이메일로 유저 정보 가져오기
   passport.deserializeUser(async function (Email, done) {
      console.log('deserialize');
      const User = require('models/user');
      const {
         email, _id, nickname, strategy
      } = await User.find({email: Email});
      done(null, {
         email, _id, nickname, strategy
      });
   })

   //가입 처리
   const GoogleStrategy = require('passport-google-auth').Strategy;
   passport.use(
      new GoogleStrategy({
         clientId: clientId,
         clientSecret: clientSecret,
         callbackURL: `${host}:` + (process.env.PORT || 4000) + '/api/auth/google/callback',
         passReqToCallback: true
      },
         async function (ctx, token, tokenSecret, profile, done) {
            const tools = require('lib/tools');
            const authCtrl = require('api/auth/auth.ctrl');
            const { emails, id, displayName } = profile;
            //mongodb에 회원 가입 혹은 로그인 처리
            const user = await authCtrl.joinUser(ctx, {
               email: emails[0].value,
               nickname: displayName,
               strategy: 'google',
               strategyId: id,
               ip: tools.getIp(ctx),
            });
            done(null, user);
         })
   )


   return passport;
};