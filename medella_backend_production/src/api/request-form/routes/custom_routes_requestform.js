module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/request-form/get_approved_list',
            handler: 'request-form.get_approved_list',
            config: {
                auth: false,
            }
        },
    ]
}