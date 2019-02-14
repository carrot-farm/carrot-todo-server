const assert = require('assert');
const should = require('should');
const request = require('supertest');
const app = require('./index');

describe('GET api/category', ()=>{
   it('리스트를 가져온다.', (done)=>{
      request(app)
      .get('/api/category')
      .end((err, res)=>{
         
         done();
      })
   })
});