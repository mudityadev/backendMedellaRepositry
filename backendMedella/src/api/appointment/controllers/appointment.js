'use strict';

const { createCoreController, sanitizeInput } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::appointment.appointment', ({ strapi }) => ({

    async bookAppointment(ctx) {
        const { doctor, date, time } = ctx.request.body;

        const targetDoctor = await strapi.entityService.findOne('api::doctor.doctor', doctor, {
            populate: { appointmentSlots: true }
        });
        // console.log(targetDoctor.npi_number) // 

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
        const patient = ctx.state.user;
        console.log(patient);
        const newAppointment = await strapi.entityService.create('api::appointment-doctor.appointment-doctor', {
            data: {
                user: patient,
                status: 'pending',
                doctor
            }
        });

        console.log(newAppointment);

        ctx.body = newAppointment

        // return sanitizeInput(newAppointment, { model: strapi.getModel('api::appointment-doctor.appointment-doctor') });
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

        return sanitizeInput(updatedAppointment, { model: strapi.getModel('api::appointment-doctor.appointment-doctor') });
    }

}));
