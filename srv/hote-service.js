const cds = require('@sap/cds');

class HotelManagemntAPI extends cds.ApplicationService {
    init() {
        debugger
        const { Guests } = this.entities;
        // Validate data sent from the UI before saving it
        this.before('CREATE', 'Guests', async (req) => {
            const guest = req.data;
            return await INSERT.into(Guest).entries(req.data);
        });
        return super.init();
    }
}

module.exports = HotelManagemntAPI;