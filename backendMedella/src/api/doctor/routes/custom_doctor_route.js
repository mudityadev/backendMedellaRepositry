module.exports = {
    "routes": [
        {
            method: 'POST',
            path: '/',
            handler: 'doctor.create',
            "config": {
                auth: false,
            },
        },

    ]
}