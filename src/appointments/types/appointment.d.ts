import { BookingActions } from "../enums/appointment";

export type IAppointmentReqData = {
  name?: string;
  phone_number?: string;
  email?: string | null;
  time?: string | null;
  date?: string | null;
  action: BookingActions;
  response: string;
};

export type IBookingData = {
  name?: string;
  phone_number?: string;
  email?: string | null;
  time?: string | null;
  date?: string | null;
  doctor_id: string;
};

export type IBookingObj = {
  id: string;
  doctor_id: string;
  date: string;
  slot: string;
  patient_id: string;
  created_at: string;
};

export type IDoctor = {
  id: string;
  name: string;
  // specialty: string;
  slots: string[];
  working_days: number[];
  phone_number: string;
  email: string;
};

export type IUserReqObj = {
  audioBuffer: Buffer;
  doctor_id: string;
  // for testing only
  // transcribedText: string;
  session_id: string;
};

export type IActionHandlerObj = {
  appointmentData: IAppointmentReqData;
  doctor_id: string;
  session_id: string;
};

export type IPatientObj = {
  id: string;
  name: string;
  phone_number: string;
  email: string | null;
  created_at: string;
  updated_at: string;
};

export type IChatTillNowObj = {
  role: string;
  content: string;
};
