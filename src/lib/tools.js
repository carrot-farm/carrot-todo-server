//============ request 객체를 기반으로 아이피를 반환한다.
exports.getIp = (req)=>{
   const ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   req.connection.socket.remoteAddress
   ;
   return ip.split(':').pop();
};