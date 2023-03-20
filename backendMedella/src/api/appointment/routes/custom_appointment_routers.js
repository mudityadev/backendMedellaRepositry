module.exports = {
    "routes": [
        {
            "method": "POST",
            "path": "/appointments/book",
            "handler": "appointment.bookAppointment",
            // "config": {
            //     auth: false,
            // }
        },
        {
            "method": "POST",
            "path": "/appointments/update-status",
            "handler": "appointment.updateAppointmentStatus",
            "config": {
                auth: false,
            }
        }
    ]
}
