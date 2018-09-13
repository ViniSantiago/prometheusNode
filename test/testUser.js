var supertest = require('supertest');
var chai = require('chai');
var app = require('../api.js');
var mongoose = require("mongoose");
var User = mongoose.model('User');

global.assert = chai.assert
global.app = app;
global.expect = chai.expect;
global.request = supertest(app);


// constantes de apis de contas relacionamento

const PATH_USER = "/user";
const PATH_SIGNUP = "/signup";
const PATH_ME = "/getme";
const PATH_DELETE_BYID = "/deletebyid";

// Products Paths
const PATH_PRODUCT = "/product";


// Geral

const URL_API = "/api";
const VERSION = "/v0";
const PATH_LIST = "/list";
const PATH_CREATE = "/create";
const PATH_LIST_ALL = "/listall";


// Usuários de teste


var nonUser = {
    email: "naoexiste@gmail.com",
    name: "naoexiste",
}

var secondUser = {
    email: 'segundo@teste.com',
    name: 'Segundo User',
    password: '123',
    passwordConf: '123'
}

var firstUser = {
    email: 'primeiro@teste.com',
    name: 'Primeiro User',
    password: '123',
    passwordConf: '123'
}

var firstUserWithPass = {
    email: 'primeiro@teste.com',
    name: 'Primeiro User',
    password: 'Pass',
    passwordConf: 'Pass',
}

var invalidUser = {
    email: "email@semnome.com",
    name: "somentenome",
    password: "pass1",
    passwordConf: "pass1"
}

var delUser = {
    _id: '',
}

var invalidUrl = "/user/login";


describe.only('app', () => {

    after(function() {
        //mongoose.connection.db.dropDatabase();
        app.close();
    });

    before((done) => { // runs before all tests

        User.remove({}, function() { // Limpa banco de dados (Collection "user") antes de iniciar os testes
            done();
        });

    });


    /****************************************************Testes / "welcome"****************************************************/

    describe('GET /', function() { //mensagem tela inicial
        it('retorna mensagem inicial', function(done) {
            request.get('/')
                .expect(200)
                .end(function(err, res) {

                    assert.property(res.body, "hobb")
                    assert.equal(res.body.hobb, "Projeto HOBB - Versão Inicial")

                    if (err) return done(err);
                    done();
                });
        });

    });

    describe('GET /api/v0', function() { //mensagem tela inicial
        it('returns welcome msg', function(done) {
            request.get(URL_API + VERSION)
                .expect(200)
                .end(function(err, res) {

                    assert.property(res.body, "hobb")
                    assert.equal(res.body.hobb, "Projeto HOBB - Versão Inicial")

                    if (err) return done(err);
                    done();
                });
        });

    });

    /****************************************************Testes /signup****************************************************/

    describe.only('PUT /signup', function() {


        it.only('register an user with password', function(done) { //registra um usuário

            request.put(URL_API + VERSION + PATH_USER + PATH_SIGNUP)
                .set('Content-type', 'application/json')
                .send(JSON.stringify(firstUserWithPass))
                .expect(200)
                .end(function(err, res) {

                    assert.property(res.body, 'success')
                    assert.property(res.body.success.data, '_id')
                    assert.isNotNull(res.body.success.data._id) //verifica se campo "_id" não é null
                    assert.isNotNull(res.body.success.data.userid) //verifica se campo "userid" não é null
                    assert.equal(res.body.success.data.name, firstUserWithPass.name)

                    if (err) return done(err);
                    done();
                })
        })

        it('register an user', function(done) { //registra um usuário

            request.put(URL_API + VERSION + PATH_USER + PATH_SIGNUP)
                .set('Content-type', 'application/json')
                .send(JSON.stringify(firstUser))
                .expect(200)
                .end(function(err, res) {

                    assert.property(res.body, 'success')
                    assert.property(res.body.success.data, '_id')
                    assert.isNotNull(res.body.success.data._id) //verifica se campo "_id" não é null
                    assert.isNotNull(res.body.success.data.userid) //verifica se campo "userid" não é null

                    delUser._id = res.body.success.data._id.toString(); //variavel para receber o id do usuário cadastrado, que será deletado posteriormente

                    console.log(delUser._id);
                    if (err) return done(err);
                    done();
                })
        })

        it('register exist email user for error', function(done) { //inclui novamente o mesmo usuário para retornar erro

            request.put(URL_API + VERSION + PATH_USER + PATH_SIGNUP)
                .set('Content-type', 'application/json')
                .send(JSON.stringify(firstUser))
                .expect(403)
                .end(function(err, res) {

                    assert.property(res.body, 'error')
                    assert.property(res.body.error, 'code')
                    assert.equal(res.body.error.code, '1')
                    assert.property(res.body.error, 'message')
                    assert.include(res.body.error.message, firstUser.email)
                    assert.property(res.body.error, 'userid')
                    assert.isNotNull(res.body.error.userid)

                    if (err) return done(err);
                    done();
                });
        });

        it('register a second user', function(done) { //inclui um segundo usuário

            request.put(URL_API + VERSION + PATH_USER + PATH_SIGNUP)
                .send(JSON.stringify(secondUser))
                .set('Content-type', 'application/json')
                .expect(200)
                .end(function(err, res) {

                    assert.property(res.body, "success")
                    assert.property(res.body.success.data, '_id')
                    assert.isNotNull(res.body.success.data._id) //verifica se campo "_id" não é null
                    assert.isNotNull(res.body.success.data.userid) //verifica se campo "userid" não é null

                    if (err) return done(err);
                    done();
                })
        });

        it('register a invalid user no pass', function(done) { //envia json sem campo "pass" para retornar erro

            request.put(URL_API + VERSION + PATH_USER + PATH_SIGNUP)
                .send(JSON.stringify(invalidUser, ['email', 'name']))
                .set('Content-type', 'application/json')
                .expect(403)
                .end(function(err, res) {

                    assert.property(res.body, "error")
                    assert.property(res.body.error, "message")

                    assert.include(res.body.error.message, "Password must be supplied")

                    if (err) return done(err);
                    done();
                })
        });

        it('register a invalid user no name', function(done) { //envia json sem campo name para retornar erro
            // Não está tratando esse erro
            request.put(URL_API + VERSION + PATH_USER + PATH_SIGNUP)
                .send(JSON.stringify(invalidUser, ['email', 'password', 'passwordConf']))
                .set('Content-type', 'application/json')
                .expect(403)
                .end(function(err, res) {

                    assert.property(res.body, "error")
                    assert.property(res.body.error, "message")

                    assert.include(res.body.error.message, "Name must be supplied")

                    if (err) return done(err);
                    done();
                })
        });

        it('register a invalid user pass not conf', function(done) { //envia json com campo "passwordConf" diferente para retornar erro
            invalidUser.passwordConf = "invalid"
            request.put(URL_API + VERSION + PATH_USER + PATH_SIGNUP)
                .send(JSON.stringify(invalidUser))
                .set('Content-type', 'application/json')
                .expect(403)
                .end(function(err, res) {

                    assert.property(res.body, "error")
                    assert.property(res.body.error, "message")

                    assert.include(res.body.error.message, "Passwords do not match")

                    if (err) return done(err);
                    done();
                })
        });

    });

    /**************************************************** Testes /listall ****************************************************/

    describe('GET / listall', function() { //retorna lista de usuários

        it('returns users list after put', function(done) { //retorna lista de usuários
            request.get(URL_API + VERSION + PATH_USER + PATH_LIST_ALL)
                .set('Content-type', 'application/json')
                .expect(200)
                .end(function(err, res) {

                    assert.include(res.body.success.data[0], firstUser)
                    assert.include(res.body.success.data[1], secondUser)

                    if (err) return done(err);
                    done();
                });
        });

    });

    /**************************************************** Testes /delete_byID ****************************************************/

    describe('DELETE /delete_byID', function() {


        it('delete an user', function(done) { //deleta o primeiro usuário incluído "firstUser"
            request.del(URL_API + VERSION + PATH_USER + PATH_DELETE_BYID)
                .set('Content-type', 'application/json')
                .send(JSON.stringify(delUser, ['_id']))
                .expect(200)
                .end(function(err, res) {

                    assert.property(res.body, "success")
                    assert.equal(res.body.success.message, "Success excluding user")
                    if (err) return done(err);
                    done();
                });
        });


        it('cant return an user', function(done) { //realiza busca de usuário deletado "firstUser"

            request.post(URL_API + VERSION + PATH_USER + PATH_ME)
                .set('Content-type', 'application/json')
                .send(JSON.stringify(firstUser, ['email']))
                .expect(403)
                .end(function(err, res) {

                    assert.property(res.body, "error")


                    if (err) return done(err);
                    done();
                });
        });

        it('returns users list after del', function(done) { //retorna lista de usuários após del
            request.get(URL_API + VERSION + PATH_USER + PATH_LIST_ALL)
                .set('Content-type', 'application/json')
                .expect(200)
                .end(function(err, res) {

                    assert.include(res.body.success.data[0], secondUser) //verifica se primeira posição do json consta o usuário "secondUser"

                    if (err) return done(err);
                    done();
                });
        });

    });

    /**************************************************** Testes /get_me ****************************************************/

    describe('POST /get_me', function() {

        it('returns an user', function(done) { //busca usuário da base "secondUser"

            request.post(URL_API + VERSION + PATH_USER + PATH_ME)
                .send(JSON.stringify(secondUser, ['email']))
                .set('Content-type', 'application/json')
                .expect(200)
                .end(function(err, res) {


                    assert.nestedProperty(res.body, "success.data.name")
                    assert.include(res.body.success.data.name, secondUser.name)

                    if (err) return done(err);
                    done();
                });
        });

        it('returns error for invalid user', function(done) { //busca usuario inexistente

            request.post(URL_API + VERSION + PATH_USER + PATH_ME)
                .send(JSON.stringify(nonUser, ['email']))
                .set('Content-type', 'application/json')
                .expect(403)
                .end(function(err, res) {

                    assert.nestedProperty(res.body, "error")

                    if (err) return done(err);
                    done();
                })

        });
    });

    /**************************************************** Testes /url invalida ****************************************************/

    describe('GET /invalid', function() {

        it('get invalid url', function(done) { //informa url inexistente na api, espera retorno "404" e mensagem de erro
            request.get(invalidUrl)
                .expect(404)
                .end(function(err, res) {
                    assert.property(res.body, 'error')
                    assert.include(res.body.error, "Url '" + invalidUrl + "' not found")
                    if (err) return done(err);
                    done();
                })
        });
    });

    describe('GET /metrics', function() {

        it('get prometheus metrics', function(done) {
            request.get('/metrics')
                .expect(200)
                .end(done)
        });
    });
});