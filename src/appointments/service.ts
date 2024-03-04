import { v4 } from "uuid";
import { AppointmentBookingHelper } from "./helper";
import {
  IActionHandlerObj,
  IAppointmentReqData,
  IBookingObj,
  IChatTillNowObj,
  IPatientObj,
  IUserReqObj,
} from "./types/appointment";
import { BookingActions } from "./enums/appointment";
import moment from "moment";
import fs from "fs";

/**
 * @class Appointment
 * @method appointmentBookingService
 * @param {IUserReqObj} userReq
 * @returns {Promise<any>}
 * @description to book the appointment
 *
 */
export default class AppointmentBookingService extends AppointmentBookingHelper {
  /**
   *
   * @param userReq  IUserReqObj
   * @returns message & audio buffer
   */
  public appointmentBookingService = async (userReq: IUserReqObj) => {
    const { doctor_id, session_id, audioBuffer } = userReq;
    let chatsTillNow: IChatTillNowObj[] = [];

    const doctorsData = await this.fetchDoctorById(doctor_id);
    const sessionData = await this.fetchSession(session_id);
    if (!sessionData) {
      await this.insertSession({
        id: session_id,
        doctor_id,
        created_at: moment().format(),
        updated_at: moment().format(),
        delete: false,
      });
    }
    const doctor_available_slots = this.buildDoctorAvailabilitySlots(
      doctorsData[0]
    );

    const transcribedText = await this.transcribeAudioIntent(audioBuffer);
    const parsedPrompt = this.buildPrompt({
      user_input: transcribedText,
      doctor_available_slots: JSON.stringify(doctor_available_slots, null, 2),
    });
    if (sessionData?.data) {
      const concurrentPrompt = this.buildConcurrentPrompts({
        user_input: transcribedText,
        context: JSON.stringify(sessionData.data, null, 2),
        parsedPrompt,
      });
      chatsTillNow.push({
        role: "user",
        content: concurrentPrompt,
      });
    } else {
      chatsTillNow.push({
        role: "user",
        content: parsedPrompt,
      });
    }

    const appointmentData = await this.analyzeTextIntent(chatsTillNow);

    const response = await this.appointmentHandler({
      doctor_id,
      appointmentData,
      session_id,
    });

    chatsTillNow.push({
      role: "assistant",
      content: appointmentData,
    });

    const sessionDataObj = {
      ...(sessionData?.data ?? {}),
      ...appointmentData,
    };
    await this.updateSession(session_id, {
      chats: chatsTillNow,
      data: sessionDataObj,
      updated_at: moment().format(),
    });

    if (response.success) {
      await this.deleteSession(session_id);
    }

    const audioResponse = await this.textToAudio(response.message);
    const responseBuffer = await audioResponse.arrayBuffer();
    // fs.writeFileSync(`audio-${session_id}.wav`, Buffer.from(responseBuffer));
    return {
      success: response.success,
      audio: responseBuffer,
      message: response.message,
    };
  };

  private appointmentHandler = async (appointmentHandlerObj: any) => {
    const { doctor_id, appointmentData, session_id } = appointmentHandlerObj;
    const { action } = appointmentData;
    const allValuesPresent = this.checkIfAllValuesArePresent(appointmentData);
    if (
      (action === BookingActions.APPOINTMENT_BOOKED && allValuesPresent) ||
      (action === BookingActions.SCHEDULE_APPOINTMENT && allValuesPresent)
    ) {
      await this.bookAppointment({
        doctor_id,
        appointmentData,
      });
      return {
        success: true,
        message: appointmentData.response,
      };
    } else if (
      (action === BookingActions.CANCEL_APPOINTMENT && allValuesPresent) ||
      (action === BookingActions.APPOINTMENT_CANCELLED && allValuesPresent)
    ) {
      await this.cancelAppointment({
        doctor_id,
        appointmentData,
      });

      return {
        success: true,
        message: appointmentData.response,
      };
    } else if (
      (action === BookingActions.RESCHEDULE_APPOINTMENT && allValuesPresent) ||
      (action === BookingActions.APPOINTMENT_RESCHEDULED && allValuesPresent)
    ) {
      await this.rescheduleAppointment({
        doctor_id,
        appointmentData,
      });

      return {
        success: true,
        message: appointmentData.response,
      };
    } else if (action === BookingActions.UNKNOWN) {
      return {
        success: false,
        message: "I'm sorry, I didn't understand that. Can you please repeat?",
      };
    }

    return {
      success: false,
      message: appointmentData.response,
    };
  };

  private bookAppointment = async (bookAppointmentObj: any) => {
    const { doctor_id, appointmentData, session_id } = bookAppointmentObj;
    const { date, time, email, user_phone_number, user_name } = appointmentData;
    const patient = await this.fetchPatientsByPhoneNumber(user_phone_number!);
    let patientId = v4();
    if (!patient) {
      const patientData: IPatientObj = {
        id: patientId,
        name: user_name ?? "",
        phone_number: user_phone_number ?? "",
        email: email ?? null,
        created_at: moment().format(),
        updated_at: moment().format(),
      };
      await this.insertPatient(patientData);
    } else {
      patientId = patient.id;
    }

    const bookingData: IBookingObj = {
      id: v4(),
      doctor_id,
      date: date!,
      slot: time!,
      patient_id: patientId,
      created_at: moment().format(),
    };
    return this.insertBooking(bookingData);
  };

  private cancelAppointment = async (cancelObj: any) => {
    const { appointmentData, doctor_id } = cancelObj;
    const bookingData = (await this.fetchBookingByAppointment({
      doctor_id,
      date: appointmentData?.date,
      slot: appointmentData?.time,
    })) as any;

    const { id } = bookingData;
    return this.cancelBooking(id);
  };

  private rescheduleAppointment = async (rescheduleObj: any) => {
    const { doctor_id, appointmentData } = rescheduleObj;
    const bookingData = (await this.fetchBookingByAppointment({
      doctor_id,
      date: appointmentData?.previous_date,
      slot: appointmentData?.previous_time,
    })) as any;

    const { id } = bookingData;
    await this.cancelBooking(id);
    return this.bookAppointment(rescheduleObj);
  };
}
