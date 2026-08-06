namespace hotel_mngmnt_app;

using { managed } from '@sap/cds/common';


entity Rooms : managed {
  key ID         : UUID;
  roomNumber     : String(10);
  type           : String(15) enum { Single; Double; Suite; Deluxe; };
  basePrice      : Decimal(10, 2);
  status         : String(15) enum { Available; Occupied; Dirty; Maintenance; } default 'Available';
  bookings       : Association to many Bookings on bookings.room = $self;
}

entity Guests : managed {
  key ID         : UUID;
  firstName      : String(50);
  lastName       : String(50);
  email          : String(100);
  phone          : String(20);
  passportOrId   : String(50);
  bookings       : Association to many Bookings on bookings.guest = $self;
}

entity Bookings : managed {
  key ID         : UUID;
  checkInDate    : Date;
  checkOutDate   : Date;
  status         : String(15) enum { Confirmed; CheckedIn; CheckedOut; Cancelled; } default 'Confirmed';
  guest          : Association to Guests;
  room           : Association to Rooms;
  invoice        : Composition of one Invoices on invoice.booking = $self;
  roomServices   : Composition of many RoomServices on roomServices.booking = $self;
}

entity Invoices : managed {
  key ID         : UUID;
  totalAmount    : Decimal(10, 2);
  paymentStatus  : String(10) enum { Unpaid; Paid; Refunded; } default 'Unpaid';
  paymentMethod  : String(15) enum { Cash; Card; UPI; NetBanking; };
  booking        : Association to Bookings;
}

entity RoomServices : managed {
  key ID             : UUID;
  serviceDescription : String(255);
  cost               : Decimal(10, 2);
  status             : String(15) enum { Requested; InProgress; Delivered; } default 'Requested';
  booking            : Association to Bookings;
}