'use strict';

/**
 * insurance service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::insurance.insurance');
