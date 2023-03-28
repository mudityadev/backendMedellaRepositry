'use strict';

/**
 * request-form controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::request-form.request-form', ({strapi})=> ({

    async get_approved_list(ctx) {
        try {
            const entries = await strapi.entityService.findMany('api::request-form.request-form', {
                filters: { status: true }
            });

            const data = entries.map(entry => ({
                id: entry.id,
                attributes: entry
            }));

            return {
                data,
                meta: {}
            };
        } catch (err) {
            console.error(err);
            return ctx.badRequest('Failed to get approved forms');
        }
    }
,

    async update(ctx) {
        const { id } = ctx.params;
        const { status } = true;

        try {
            const entry = await strapi.entityService.update('api::request-form.request-form', id, {
                data: {
                    status: true
                }
            });

            return {
                data: {
                    id: entry.id,
                    attributes: entry
                },
                meta: {}
            };
        } catch (err) {
            console.error(err);
            return ctx.badRequest('Failed to update request form');
        }
    }



}));
