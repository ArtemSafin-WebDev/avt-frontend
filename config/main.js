/** General Configurations Like PORT, HOST names and etc... */

const endpoints = {
  testing: 'http://avt.stride.one/api/v1',
  development: 'http://localhost/api/v1',
  production: 'https://avt.travel/api/v1',
  default: 'http://localhost/api/v1'
};

const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 5000,
  apiEndpoint: endpoints[process.env.NODE_ENV] || endpoints.default,
  karmaPort: 9876,

  productExpiration: {
    avia: 60, // minutes
    train: 60,
    hotel: 60,
  },

  // This part goes to React-Helmet for Head of our HTML
  app: {
    head: {
      'data-wf-site': '5a3289b60672a700015bc1e6',
      'title': 'Онлайн бронирование авиабилетов',
      'titleTemplate': 'AVT · %s',
      'meta': [
        { charset: 'utf-8' },
        { 'http-equiv': 'x-ua-compatible', 'content': 'ie=edge' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'АВТ онлайн бронирование авиабилетов' },
      ],
    },
  },
};

module.exports = config;
