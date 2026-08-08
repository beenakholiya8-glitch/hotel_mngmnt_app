const cds = require('@sap/cds');
class HotelManagementAPI extends cds.ApplicationService {

    init() {
        debugger
        const { Guests } = this.entities;
        // Validate data sent from the UI before saving it
        // this.before('CREATE', 'Guests', async (req) => {
        //       const userId = req.user.id; 
        //     console.log(`Current User: ${userId}`);
        //     const guest = req.data;
        //     return await INSERT.into(Guest).entries(req.data);
        // });

        this.on('getUserInfo', req => {
            return {
                id: req.user.id,                    // Will output "mock" during local dev
                email: req.user.email || "local-developer@test.com"
            };
        });
        return super.init();
    }
}

module.exports = HotelManagementAPI;