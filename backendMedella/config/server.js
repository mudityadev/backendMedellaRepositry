module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },


  auth: {
    strategies: {
      google: {
        provider: 'google',
        plugin: 'provider',
        conf: {
          clientId: env('GOOGLE_CLIENT_ID'),
          clientSecret: env('GOOGLE_CLIENT_SECRET'),
          scope: ['email'],
          callbackURL: env('GOOGLE_CALLBACK_URL', 'http://localhost:1337/connect/google/callback'),
        },
      },
    },
  },
});
