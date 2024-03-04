import { db as mong } from "../config/mongo.config";
import { MongoCollections } from "./enums/appointment";

export default class AppointmentBookingDb {
  protected fetchDoctorById = async (doctorId: string) => {
    const pipeline = [
      {
        $lookup: {
          from: "bookings",
          localField: "id",
          foreignField: "doctor_id",
          as: "bookings",
        },
      },
      {
        $match: {
          id: doctorId,
          cancelled: { $ne: true },
        },
      },
      {
        $project: {
          id: 1,
          name: 1,
          slots: 1,
          working_days: 1,
          phone_number: 1,
          email: 1,
          bookings: 1,
        },
      },
    ];

    return mong
      .collection(MongoCollections.DOCTORS)
      .aggregate(pipeline)
      .toArray() as unknown as any;
  };

  protected insertBooking = async (bookingData: any) => {
    return mong.collection(MongoCollections.BOOKINGS).insertOne(bookingData);
  };

  protected fetchPatientsByPhoneNumber = async (phoneNumber: string) => {
    return mong
      .collection(MongoCollections.PATIENTS)
      .findOne({ phone_number: phoneNumber });
  };

  protected insertPatient = async (patientData: any) => {
    return mong.collection(MongoCollections.PATIENTS).insertOne(patientData);
  };

  protected fetchBookingByAppointment = async (appointmentData: any) => {
    return mong.collection(MongoCollections.BOOKINGS).findOne({
      doctor_id: appointmentData.doctor_id,
      date: appointmentData.date,
      slot: appointmentData.slot,
    });
  };

  protected cancelBooking = async (id: string) => {
    return mong
      .collection(MongoCollections.BOOKINGS)
      .updateOne({ id }, { $set: { cancelled: true } });
  };

  protected insertSession = async (sessionData: any) => {
    return mong.collection(MongoCollections.SESSIONS).insertOne(sessionData);
  };

  protected fetchSession = async (sessionId: string): Promise<any> => {
    return mong
      .collection(MongoCollections.SESSIONS)
      .findOne({ id: sessionId });
  };

  protected updateSession = async (sessionId: string, sessionData: any) => {
    return mong
      .collection(MongoCollections.SESSIONS)
      .updateOne({ id: sessionId }, { $set: sessionData });
  };

  protected deleteSession = async (sessionId: string) => {
    return mong
      .collection(MongoCollections.SESSIONS)
      .updateOne({ id: sessionId }, { $set: { deleted: true } });
  };
}
