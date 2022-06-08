module.exports = {
  routes: './src/routes.ts',
  connector: '@layer0/starter',
  backends: {
    origin: {
      domainOrIp: 'www.nike.com',
      hostHeader: 'www.nike.com',
    },
    images: {
      domainOrIp: 'www.cdn.com',
      hostHeader: 'www.cdn.com',
    },
  },
}
