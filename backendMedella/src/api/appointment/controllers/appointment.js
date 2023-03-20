'use strict';

const { createCoreController, sanitizeEntity } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::appointment.appointment', ({ strapi }) => ({

    async bookAppointment(ctx) {
        const { doctor, date, time } = ctx.request.body;

        const targetDoctor = await strapi.entityService.findOne('api::doctor.doctor', doctor, {
            populate: { appointmentSlots: true }
        });

        if (!targetDoctor) {
            return ctx.throw(400, 'Invalid doctor ID');
        }

        const appointmentSlots = targetDoctor.appointmentSlots || [];
        const slotAvailable = appointmentSlots.some(slot =>
            slot.date === date && slot.time === time && slot.status === 'available'
        );

        if (!slotAvailable) {
            // Filter available slots and return them
            const availableSlots = appointmentSlots.filter(slot => slot.status === 'available');
            return ctx.body = {
                message: 'Slot not available',
                availableSlots
            };
        }

        const newAppointment = await strapi.entityService.create('api::appointment-doctor.appointment-doctor', {
            data: {
                ...ctx.request.body,
                status: 'pending',
                patient: ctx.state.user
            }
        });

        console.log(newAppointment);

        return sanitizeEntity(newAppointment, { model: strapi.models.appointment });
    },

    async updateAppointmentStatus(ctx) {
        const { id, status } = ctx.request.body;

        const appointment = await strapi.entityService.findOne('api::appointment-doctor.appointment-doctor', id);

        if (!appointment) {
            return ctx.throw(400, 'Invalid appointment ID');
        }

        const updatedAppointment = await strapi.entityService.update('api::appointment-doctor.appointment-doctor', id, {
            data: { status }
        });

        return sanitizeEntity(updatedAppointment, { model: strapi.models.appointment });
    }

}));





