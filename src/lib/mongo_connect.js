const mongoose = require('mongoose');      
exports.connect = async (url)=>{
   try{
      mongoose.Promise = global.Promise; //Node의 Promise를 사용하도록 설정.
      const connection = await mongoose.connect(url, {useNewUrlParser:true});
      console.log('connected mongoose');
      return connection;
   }catch(e){
      console.log('mongodb connections failed \n', e);
   }
}