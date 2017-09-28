require('babel-polyfill');

const environment = {
    development: {
        isProduction: false
    },
    production: {
        isProduction: true
    }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT,
    apiHost: process.env.APIHOST || 'localhost',
    apiPort: process.env.APIPORT,
    app: {
        title: 'dog-chat',
        description: 'dog-chat',
        head: {
            titleTemplate: 'dog-chat: %s',
            meta: [
                { name: 'description', content: 'dog-chat' },
                { charset: 'utf-8' },
                { property: 'og:site_name', content: 'dog-chat' },
                { property: 'og:image', content: 'dog.png' },
                { property: 'og:locale', content: 'en_US' },
                { property: 'og:title', content: 'dog-chat' },
                { property: 'og:description', content: 'dog-chat' },
                { property: 'og:card', content: 'dog-chat' },
                { property: 'og:site', content: 'dog-chat' },
                { property: 'og:creator', content: 'jzc' },
                { property: 'og:image:width', content: '200' },
                { property: 'og:image:height', content: '200' }
            ]
        }
    },
}, environment);
