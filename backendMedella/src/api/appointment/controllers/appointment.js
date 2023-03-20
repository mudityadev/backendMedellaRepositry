'use strict';

/**
 * appointment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::appointment.appointment', ({ strapi }) => ({

    async bookAppointment(ctx) {
        const { doctor, date, time } = ctx.request.body;

        // Find the doctor by ID
        // const targetDoctor = await strapi.services.doctor.findOne({ id: doctor });

        const targetDoctor = await strapi.db.query('api::doctor.doctor').findOne({
            where: { id: doctor }
        })

        console.log(targetDoctor);
        

        if (!targetDoctor) {
            return ctx.throw(400, 'Invalid doctor ID');
        }

        // Check if the slot is available
        const slotAvailable = targetDoctor.appointmentSlots.some(slot =>
            slot.date === date && slot.time === time && slot.status === 'available'
        );

        if (!slotAvailable) {
            return ctx.throw(400, 'Slot not available');
        }

        // Create appointment
        const newAppointment = await strapi.services.appointment.create({
            ...ctx.request.body,
            status: 'Pending',
            patient: ctx.state.user.id
        });

        // Send notification to the doctor (e.g. via email or SMS)
        // You can use a service like SendGrid, Mailgun, or Twilio for this purpose
        // ...
        console.log(newAppointment);


        return sanitizeEntity(newAppointment, { model: strapi.models.appointment });
    },

    async updateAppointmentStatus(ctx) {
        const { id, status } = ctx.request.body;

        // Find the appointment by ID
        const appointment = await strapi.services.appointment.findOne({ id });

        if (!appointment) {
            return ctx.throw(400, 'Invalid appointment ID');
        }

        // Update appointment status
        const updatedAppointment = await strapi.services.appointment.update({ id }, { status });

        // Notify the patient (e.g. via email or SMS) if the appointment has been accepted or rejected
        // ...
        console.log(updatedAppointment);

        return sanitizeEntity(updatedAppointment, { model: strapi.models.appointment });
    }


}));
