"use strict";

var Prometheus = require("prom-client");

module.exports = function(app) {
  var apiController = require("../controllers/apiController");

  // Common Paths
  const URL_API = "/api";
  const VERSION = "/v0";
  const PATH_LIST = "/list";
  const PATH_CREATE = "/create";
  const PATH_LIST_ALL = "/listall";

  // Prometheus Metrics Path
  const PATH_METRICS = "/metrics";
  app.get(PATH_METRICS, (req, res) => {
    res.end(Prometheus.register.metrics());
  });

  // User Paths
  const PATH_USER = "/user";
  const PATH_SIGNUP = "/signup";
  const PATH_ME = "/getme";
  const PATH_DELETE_BYID = "/deletebyid";

  app.route("/").get(apiController.welcome);

  app.route(URL_API + VERSION).get(apiController.welcome);

  app.route(URL_API + VERSION + PATH_USER + PATH_ME)
  .post(apiController.get_me);
  
  app
    .route(URL_API + VERSION + PATH_USER + PATH_SIGNUP)
    .put(apiController.sign_up_user);
  
  app
    .route(URL_API + VERSION + PATH_USER + PATH_LIST_ALL)
    .get(apiController.list_all_users);

  app
    .route(URL_API + VERSION + PATH_USER + PATH_DELETE_BYID)
    .delete(apiController.delete_user);

  // Products Paths
  const PATH_PRODUCT = "/product";
  app
    .route(URL_API + VERSION + PATH_PRODUCT + PATH_LIST)
    .get(apiController.list_product);

  app
  .route(URL_API + VERSION + PATH_PRODUCT + PATH_CREATE)
  .put(apiController.create_product);
};