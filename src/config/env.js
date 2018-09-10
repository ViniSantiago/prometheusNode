exports.Env = {
    app: {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
    },
    db: {
      url: process.env.MONGO_URL || 'mongodb://mongo:27017/box',
      pwd: process.env.MONGO_PWD,
      user: process.env.MONGO_USER,
    },
    server: {
      port: process.env.API_PORT || 3443,
    },
    kernel:{
        authorization: process.env.KERNEL_AUTHORIZATION  || 'nUgVsgTqYjvNd6EV6Ftmq7ZxYaEkM8Cl',
        url_kernel_account: process.env.KERNEL_ACCOUNT || 'https://api.kernel.io.bb.com.br:8081/v0/accounts',
    }
};
  