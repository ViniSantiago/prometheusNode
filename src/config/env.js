exports.Env = {
    app: {
        name: process.env.npm_package_name,
        version: process.env.npm_package_version,
    },
    db: {
        url: process.env.MONGO_URL || 'mongodb://hobb-db:27017/hobb',
        pwd: process.env.MONGO_PWD,
        user: process.env.MONGO_USER,
    },
    server: {
        port: process.env.API_PORT || 3443,
    },
    kernel: {
        authorization: process.env.KERNEL_AUTHORIZATION || '7egQpg76YVH1YSkdUpzJL8MIbafZ2DJQ6AMFHV6n',
        url_kernel_account: process.env.KERNEL_ACCOUNT || 'https://api.kernel.io.bb.com.br/v0/accounts',
    }
};