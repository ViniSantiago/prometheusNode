var Config = require("../config/env");
var request = require("request");
var exports = module.exports = {};

var mongoose = require("mongoose");
var User = mongoose.model("User");

function registerKernel(_user) {
    var _data = {
      owner: _user.userid
    };
    var _header = {
      "content-type": "application/json",
      "x-api-key": Config.Env.kernel.authorization
    };
  
    return new Promise(function (resolve, reject) {
      request.post({
          headers: _header,
          url: Config.Env.kernel.url_kernel_account,
          body: _data,
          strictSSL: false,
          timeout: 1500,
          json: true
        },
        function (erro, res) {
          console.log("Kernel call statusCode: " + res.statusCode);
  
          if (erro || (res.statusCode != 201 )) {
            console.log("Error reaching Kernel: " + erro);
            reject({
              error: {
                code: 300,
                message: "Kernel user registration error: " + erro
              }
            });
          } else {
            console.log("Kernel call resp: " + JSON.stringify(res));
            console.log("Kernel call OK: " + res.body.data.id);
            resolve(res.body.data.id);
          }
        }
      );
    });
}

function newUserValidation(_user) {
  /* Verifica existencia de mesmo email para outro usuario */
  return new Promise(function (resolve, reject) {
      User.findOne({
          email: _user.email
      }, null, function (err, user) {
          if (err) {
              reject({
                  error: {
                      code: 200,
                      message: "Error validating email - " + err
                  }
              });
          }
          if (user) {
              reject({
                  error: {
                      code: 1,
                      message: "Email '" + _user.email + "' already been taken by someone else",
                      userid: user.userid
                  }
              });
          } else {
              resolve();
          }
      });
  });
}

module.exports = { registerKernel, newUserValidation };