import AppointmentBookingService from "./service";
import { IUserReqObj } from "./types/appointment";

/**
 * @class AppointmentBookingController
 * @method bookingSocketController
 * @param {IUserReqObj} request
 * @returns {Promise<any>}
 * @description to book the appointment
 */
export class AppointmentBookingController extends AppointmentBookingService {
  /**
   *
   * @param request  IUserReqObj
   * @returns message & audio buffer
   */
  public bookingSocketController = async (request: IUserReqObj) => {
    try {
      const appointmentData = await this.appointmentBookingService(request);
      return appointmentData;
    } catch (error) {
      console.log("error: ", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  };
}
