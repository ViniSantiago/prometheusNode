"use strict";
var validation = require('./functions.js')
var Util = require("util");
var uuid = require("node-uuid");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Product = mongoose.model("Product");
var Prometheus = require("prom-client");
// Prometheus Counter for API calls
const PrometheusMetrics = {
    requestCounter: new Prometheus.Counter({
        name: "hobb_api",
        help: "Number of routers call",
        labelNames: ["method", "path", "statusCode"]
    })
};

exports.welcome = function (req, res) {
    PrometheusMetrics.requestCounter.inc({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
    });
    return res.json({
        hobb: "Projeto HOBB - Versão Inicial"
    });
};

exports.list_all_users = function (req, res) {
    User.find({}, function (err, user) {
        if (err) {
            res.status(403).json({
                error: {
                    code: 1,
                    message: err
                }
            });
        }
        res.json({
            success: {
                data: user
            }
        });
    });
    PrometheusMetrics.requestCounter.inc({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
    });
};

exports.sign_up_user = function (req, res) {
    console.log("Sign_up Body\n" + Util.inspect(req.body, false, null));
    validation.newUserValidation(req.body).then(
        function (resultValidation) {
            validation.registerKernel(req.body).then(
                function (resultKernel) {
                    req.body.userid = uuid.v4();
                    req.body.kernelid = resultKernel;
                    var new_user = new User(req.body);
                    new_user.save(function (err, user) {
                        if (err) {
                            return res.status(403).json({
                                error: {
                                    code: 100,
                                    message: err
                                }
                            });
                        } else {
                            return res.json({
                                success: {
                                    data: user
                                }
                            });
                        }
                    });
                },
                function (err) {
                    // Erro registrando ID o Kernel
                    return res.status(403).json(err);
                }
            );
        },
        function (err) {
            // Erro na validacao dos Dados
            return res.status(403).json(err);
        }
    );
    PrometheusMetrics.requestCounter.inc({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
    });
};

exports.get_me = function (req, res) {
    User.findOne({
        email: req.body.email
    }, null, function (err, user) {
        if (err) {
            res.status(403).json({
                error: {
                    code: 1,
                    message: err
                }
            });
        } else {
            if (!user) {
                res.status(403).json({
                    error: {
                        code: 100,
                        message: 'User not found'
                    }
                });
            } else {
                res.json({
                    success: {
                        data: user
                    }
                });
            }
        }
    });
    PrometheusMetrics.requestCounter.inc({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
    });
};

exports.delete_user = function (req, res) {
    User.findByIdAndRemove(req.body._id, (err, result) => {
        if (err) {
            res.status(403).json({
                error: {
                    code: 1,
                    message: 'Error excluding user with _id: ' + req.body._id
                }
            });
        } else {
            res.json({
                success: {
                    message: "Success excluding user",
                    data: result
                }
            });
        }
    });
    PrometheusMetrics.requestCounter.inc({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
    });
};



exports.list_product = function (req, res) {
    Product.find({}, function (err, product) {
        if (err) {
            res.status(403).json({
                error: {
                    code: 1,
                    message: err
                }
            });
        }
        res.json({
            success: {
                data: product
            }
        });
    });
    PrometheusMetrics.requestCounter.inc({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
    });
};

exports.create_product = async function (req, res) {
    var resultKernel = await validation.registerKernel(req.body);
    await Product.create({
            kernelid: resultKernel,
            description: req.body.description,
            balance: 0,
            balanceAsString: "0",
            transaction: [],
            tags: req.body.tags
        },
        function (error, product) {
            if (error) {
                res.status(403).json({
                    error: {
                        code: 1,
                        message: error
                    }
                });
            }
            res.json({
                success: {
                    data: product
                }
            });
        }
    );
    PrometheusMetrics.requestCounter.inc({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
    });
};