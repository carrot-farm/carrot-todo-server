const passport = require('koa-passport');
const {PORT: port, GOOGLE_CALLBACK: google_callback} = process.env;

//========== 구글 로그인
exports.auth_google = (ctx, next)=>{
   passport.authenticate('google-oauth-jwt', {
      callbackUrl: `http://localhost:${port}${google_callback}`,
      scope: 'email'
   })(ctx, next);
};

//========== 구글 콜백
exports.auth_google_callback = (ctx, next)=>{
   passport.authenticate('google-oauth-jwt', {
      callbackUrl: `http://localhost:{$port}${google_callback}`
   })(ctx, next);

   ctx.redirect('/')
};