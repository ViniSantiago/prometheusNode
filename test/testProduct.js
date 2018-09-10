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


describe('app', () => {

    after(function() {
        app.close();
    });

    var firstProduct = {
        description: 'primeiro produto', 
        tags: "1,2,3"
    }

    describe('CREATE/', function() { //Cria produto associado a uma conta
        it('create a product', function(done) {
            request.put(URL_API + VERSION + PATH_PRODUCT + PATH_CREATE)
            .set('Content-type', 'application/json')
            .send(JSON.stringify(firstProduct))
            .expect(200)
            .end(function(err,res){

                console.log(res.body.success.data.describe)  
                
                assert.property(res.body,'success')
                assert.property(res.body.success,'data')
                assert.property(res.body.success.data,'balance')
                assert.property(res.body.success.data,'balanceAsString')
                assert.property(res.body.success.data,'transactions')
             
                assert.property(res.body.success.data, "description") 
                assert.include(res.body.success.data.description, firstProduct.description )

                assert.property(res.body.success.data, "tags") 
                assert.include(res.body.success.data.tags, firstProduct.tags )  
                       
                if (err) return done(err);
                done();
            })
            
        })
    })
           
     describe('LIST /', function() { //lista produtos
        it('lista produtos', function(done) {

            request.get(URL_API + VERSION + PATH_PRODUCT + PATH_LIST)
            .expect(200)
            .end(function(err,res){
               
                assert.property(res.body,'success')          
                if (err) return done(err);
                done();

            })
        })
    })


});