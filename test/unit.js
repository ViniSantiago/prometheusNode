var supertest = require('supertest');  
var chai = require('chai');  
var app = require('../api.js');

 global.assert = chai.assert
global.app = app;  
global.expect = chai.expect;  
global.request = supertest(app); 


// constantes de apis de contas relacionamento

var anUser = {
    email: 'user@teste.com', 
    name: 'User'
}

describe('app_unit_test', () => {

    before(function() {
    
    });

    after(function() {

    });
    

    /****************************************************Testes / "welcome"****************************************************/

    describe('GET /', function() { //mensagem tela inicial
       it('retorna json e status 200', function(done) {
           request
            .get('/')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {

                expect(res.body.box, "Mensagem inicial ok").to.equal('Projeto Box - Versão Inicial')

                if (err) return done(err);
                done();
            });
        });
    
    });
    
    describe('GET /', function() { //mensagem tela inicial
        it('retorna json e status 200', function(done) {
            request.get('/api/v0')
             .expect(200)
             .expect('Content-Type', /json/)
             .end(function (err, res) {

                expect(res.body.box, "Mensagem inicial ok").to.equal('Projeto Box - Versão Inicial')

                if (err) return done(err);
                done();
            });
         });
     
    });

    describe('PUT /signup', function() {
    
        it('register an user', function(done) {    //registra um usuário
    
            request.put ('/api/v0/user/signup') 
            .set('Content-type', 'application/json')
            .send (JSON.stringify(anUser))
            .expect(200)
            .expect('Content-Type', /json/)             
            .end(function(err, res){

                if (err) return done(err);
                done();
            });
        });
    });
});