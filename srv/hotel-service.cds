using { hotel_mngmnt_app as model } from '../db/schema';

service HotelManagementAPI {

    entity Rooms        as projection on model.Rooms;
    entity Guests       as projection on model.Guests;
    entity Bookings     as projection on model.Bookings;
    entity Invoices     as projection on model.Invoices;
    entity RoomServices as projection on model.RoomServices;

     type UserDetails {
        id    : String;
         email : String;
    }

    function getUserInfo() returns UserDetails;
}
