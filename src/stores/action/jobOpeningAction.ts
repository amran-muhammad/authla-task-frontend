import Axios from "axios";

export default {
    async updateBooking(item: any) {
        try {
            const res = await Axios.put("/cms/bookings", item);
            console.log(res);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    
};
