export enum BookingActions {
  SCHEDULE = "schedule",
  CANCEL = "cancel",
  RESCHEDULE = "reschedule",
  SCHEDULE_ENQUIRY = "schedule_enquiry",
  UNKNOWN = "unknown",
  SAVE_CONTACT = "save_contact",

  // success response
  APPOINTMENT_BOOKED = "appointment_booked",
  APPOINTMENT_CANCELLED = "appointment_cancelled",
  APPOINTMENT_RESCHEDULED = "appointment_rescheduled",

  SCHEDULE_APPOINTMENT = "schedule_appointment",
  CANCEL_APPOINTMENT = "cancel_appointment",
  RESCHEDULE_APPOINTMENT = "reschedule_appointment",
}

export enum MongoCollections {
  DOCTORS = "doctors",
  BOOKINGS = "bookings",
  PATIENTS = "patients",
  SESSIONS = "sessions",
}
