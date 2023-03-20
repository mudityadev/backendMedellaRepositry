'use strict';

/**
 * appointment-doctor service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::appointment-doctor.appointment-doctor');
