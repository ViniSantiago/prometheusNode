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

exports.welcome = function(req, res) {
    PrometheusMetrics.requestCounter.inc({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
    });
    return res.json({
        hobb: "Projeto HOBB - Versão Inicial",
        version: "0.0.1"
    });
};

exports.list_all_users = function(req, res) {
    User.find({}, function(err, user) {
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

exports.sign_up_user = async function(req, res) {
    console.log("Sign_up Body\n" + Util.inspect(req.body, false, null));
    try {
        await validation.newUserValidation(req.body);
        let userid = uuid.v4();
        let resultKernel = await validation.registerKernel(req.body);
        let user = await User.create({
            userid: userid,
            kernelid: resultKernel,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cellphone: req.body.cellphone,
            cpfcnpj: req.body.cpfcnpj,
            products: [req.body.products]
        });
        res.json({
            success: {
                data: user
            }
        });
    } catch (error) {
        res.status(403).json(error);
    }
    PrometheusMetrics.requestCounter.inc({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
    });
    return res;
};

exports.get_me = async function(req, res) {
    await User.findOne({
        email: req.body.email
    }, (error, user) => {
        if (error) {
            res.status(403).json({
                error: {
                    code: 1,
                    message: error
                }
            });
        } else if (!user) {
            res.status(403).json({
                error: {
                    code: 100,
                    message: "User not found"
                }
            });
        } else {
            res.json({
                success: {
                    data: user
                }
            });
        }
    });
    PrometheusMetrics.requestCounter.inc({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
    });
    return res;
};
exports.signin = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            res.status(403).json({
                error: {
                    code: 100,
                    message: err
                }
            })
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (err) {
                    res.status(403).json({
                        error: {
                            code: 101,
                            message: err
                        }
                    })
                } else if (isMatch == false) {
                    res.status(403).json({
                        error: {
                            code: 1,
                            message: "Invalid Password"
                        }
                    })
                } else {
                    user.password = null;
                    res.json({
                        success: {
                            data: user
                        }
                    })

                }
            })
        }
    });
};

exports.delete_user = function(req, res) {
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

exports.user_product_list = async function(req, res) {
    await User.findOne({
        email: req.body.email
    }, (error, user) => {
        if (error) {
            res.status(403).json({
                error: {
                    code: 1,
                    message: error
                }
            });
        } else if (!user) {
            res.status(403).json({
                error: {
                    code: 100,
                    message: "User not found"
                }
            });
        } else {
            res.json({
                success: {
                    data: user
                }
            });
        }
    });
    PrometheusMetrics.requestCounter.inc({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
    });
    return res;
};

exports.list_product = function(req, res) {
    Product.find({}, function(err, product) {
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

exports.create_product = async function(req, res) {
    var resultKernel = await validation.registerKernel(req.body);
    await Product.create({
            kernelid: resultKernel,
            description: req.body.description,
            balance: 0,
            balanceAsString: "0",
            transaction: [],
            tags: req.body.tags
        },
        function(error, product) {
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