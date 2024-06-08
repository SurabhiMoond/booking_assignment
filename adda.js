class Booking {
  constructor() {
      this.facilities = [
          { name: 'Clubhouse', isSlot: true, slots: [{ start: 10, end: 16, price: 100 }, { start: 16, end: 22, price: 500 }] },
          { name: 'Tennis Court', isSlot: false, price: 50 }
      ];
      this.bookings = [];
  }
  facilityBooking(name, date, startTime, endTime) {
      const facility = this.facilities.find(f => f.name === name);
      if (!facility) {
          console.log("Facility not found");
          return;
      }
      const bookingTime = new Date(date + ' ' + startTime);
      const bookingEndTime = new Date(date + ' ' + endTime);

      if (this.isAlreadyBooked(name, bookingTime, bookingEndTime)) {
          console.log("Booking Failed, Already Booked");
          return;
      }
      let totalAmount = 0;
      if (facility.isSlot) {
          for (const slot of facility.slots) {
              if (this.isInSlot(bookingTime, slot.start, slot.end)) {
                  const slotEndTime = new Date(date + ' ' + (slot.end < 10 ? '0' + slot.end : slot.end) + ':00');
                  totalAmount += this.totalSlotAmount(bookingTime, bookingEndTime, slot.start, slotEndTime, slot.price);
              }
          }
      } else {
          totalAmount = this.totalHourAmount(bookingTime, bookingEndTime, facility.price);
      }
      this.bookings.push({ name, date, startTime, endTime, amount: totalAmount });
      console.log(`Booked, Rs. ${totalAmount}`);
  }
  isAlreadyBooked(name, startTime, endTime) {
      return this.bookings.some(booking =>
          booking.name === name &&
          new Date(booking.date + ' ' + booking.startTime) < endTime &&
          new Date(booking.date + ' ' + booking.endTime) > startTime
      );
  }
  isInSlot(time, start, end) {
      return time.getHours() >= start && time.getHours() < end;
  }
  totalSlotAmount(bookingStart, bookingEnd, slotStart, slotEnd, price) {
      const overlapStart = Math.max(bookingStart, slotStart);
      const overlapEnd = Math.min(bookingEnd, slotEnd);
      const overlapHours = (overlapEnd - overlapStart) / 1000 / 60 / 60;  //It's convert mili second --> sec ---> mintues--> hours
      return overlapHours * price;
  }
  totalHourAmount(startTime, endTime, price) {
      const hours = (endTime - startTime) / 1000 / 60 / 60;  //It's convert mili second --> sec ---> mintues--> hours
      return hours * price;
  }
}

//Test Cases
const booking_data = new Booking();
booking_data.facilityBooking('Clubhouse', '2020-10-26', '16:00', '22:00');
booking_data.facilityBooking('Tennis Court', '2020-10-26', '16:00', '20:00');
booking_data.facilityBooking('Clubhouse', '2020-10-28', '16:00', '20:00');
booking_data.facilityBooking('Tennis Court', '2020-10-26', '17:00', '21:00');


