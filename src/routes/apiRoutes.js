"use strict";

var Prometheus = require("prom-client");

module.exports = function(app) {
    var apiController = require("../controllers/apiController");

    // Common Paths
    const URL_API = "/api";
    const VERSION = "/v0";
    const PATH_LIST = "/list";
    const PATH_ADD = "/add";
    const PATH_LIST_ALL = "/listall";

    // Prometheus Metrics Path
    const PATH_METRICS = "/metrics";

    // User Paths
    const PATH_USER = "/user";
    const PATH_SIGNUP = "/signup";
    const PATH_SIGNIN = "/signin";
    const PATH_ME = "/getme";
    const PATH_DELETE_BYID = "/deletebyid";

    // Products Paths
    const PATH_PRODUCT = "/product";

    // Routes

    // /welcome
    app.route("/")
       .get(apiController.welcome);

    // /metrics
    app.get(PATH_METRICS, (req, res) => {
        res.end(Prometheus.register.metrics());
    });

    // /api/v0
    app.route(URL_API + VERSION)
       .get(apiController.welcome);

    // /api/v0/user/getme
    app.route(URL_API + VERSION + PATH_USER + PATH_ME)
       .post(apiController.get_me);

    // /api/v0/user/signsup
    app.route(URL_API + VERSION + PATH_USER + PATH_SIGNUP)
       .put(apiController.sign_up_user);

    // /api/v0/user/signin
    app.route(URL_API + VERSION + PATH_USER + PATH_SIGNIN)
       .put(apiController.signin);

    // /api/v0/user/listall   
    app.route(URL_API + VERSION + PATH_USER + PATH_LIST_ALL)
       .get(apiController.list_all_users);

    // /api/v0/user/deletebyid   
    app.route(URL_API + VERSION + PATH_USER + PATH_DELETE_BYID)
       .delete(apiController.delete_user);

    //   api/v0/user/product/add/     
    app.route(URL_API + VERSION + PATH_USER + PATH_PRODUCT + PATH_ADD)
       .post(apiController.add_product);

    //  /api/v0/user/product/list       
    app.route(URL_API + VERSION + PATH_USER + PATH_PRODUCT + PATH_LIST)
       .post(apiController.user_product_list);

    //   api/v0/product/list/    
    app.route(URL_API + VERSION + PATH_PRODUCT + PATH_LIST)
       .get(apiController.list_product);


};