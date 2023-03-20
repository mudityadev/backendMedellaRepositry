'use strict';

/**
 * doctor controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::doctor.doctor', ({ strapi }) => ({
    async create(ctx) {
        const data = {
            ...ctx.request.body,
            appointmentSlots: ctx.request.body.appointmentSlots || [],
        };

        const newDoctor = await strapi.services.doctor.create(data);
        return sanitizeEntity(newDoctor, { model: strapi.models.doctor });
    },




}));
