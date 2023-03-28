'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
// const { sanitizeEntity } = require("strapi-utils/lib");
const { sanitizeEntity } = require('@strapi/utils');

module.exports = createCoreController('api::appointment.appointment', ({ strapi }) => ({

    async bookAppointment(ctx) {
        const { doctor, date, time } = ctx.request.body;
        const patient = ctx.state.user;

        const alreadyBooked = await strapi.db.query('api::appointment-doctor.appointment-doctor').findMany({
            where: {
                user: patient,
                doctor,
            },
        });
        console.log();

        if (alreadyBooked[0].status != "completed"){
            if (alreadyBooked || alreadyBooked.length === 0) {
                console.log("Error: Already Booked");
                ctx.body = "Error: Already Booked";
                return;
            }
        }
     
        // user doctor admin
        // appointment
        // search --> filtering --> service, location, specialty, insurance, slots 
        // query api 

        // homepage --> 
        // top-doc premium --> is_paid/premium = true/false
        // object/model --> ads -> {id, pos, pagation -->1,...,3}
        // id--> 2, pos -> 2
        // user -> one to many --> review --> doctor 

        

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
        console.log(patient);



        const appointmentData = {
            user: patient,
            doctor,
            status: 'pending',
        };

        // const sanitizedData = sanitizeEntity(appointmentData, { model: strapi.getModel('api::appointment-doctor.appointment-doctor') });

        const newAppointment = await strapi.entityService.create('api::appointment-doctor.appointment-doctor', {
            data: appointmentData,
        });

        console.log(newAppointment);

        ctx.body = newAppointment;

        // return sanitizeEntity(newAppointment, { model: strapi.getModel('api::appointment-doctor.appointment-doctor') });
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

        return sanitizeEntity(updatedAppointment, { model: strapi.getModel('api::appointment-doctor.appointment-doctor') });
    }

}));
