import { ChatCompletion } from "openai/resources/chat/completions";
import { openAI } from "../config/openai";
import AppointmentBookingDb from "./db";
import { OpenAIModel } from "./enums/openai";
import { IAppointmentReqData } from "./types/appointment";
import { toFile } from "openai";
import { BookingActions } from "./enums/appointment";
import { Transcription } from "openai/resources/audio/transcriptions";
import { concurrentPrompt, prompt } from "./constants/prompt";
import moment from "moment";
import fs from "fs";
import { v4 } from "uuid";

export class AppointmentBookingHelper extends AppointmentBookingDb {
  /**
   *
   * @param audio  Buffer
   * @returns transcribed text
   * @description to transcribe the audio
   */
  public transcribeAudioIntent = async (audio: Buffer) => {
    const audioId = v4();
    fs.writeFileSync(`audio-${audioId}.wav`, audio);
    // const audioFile = await toFile(audio, "audio/wav");
    const model = await openAI.audio.transcriptions.create({
      file: fs.createReadStream(`audio-${audioId}.wav`),
      model: "whisper-1",
    });

    const { text } = model as Transcription;

    return text ?? "";
  };

  /**
   *
   * @param chats  any[]
   * @returns IAppointmentReqData
   * @description to analyze the text intent
   */
  public analyzeTextIntent = async (chats: any[]): Promise<any> => {
    if (!chats.length) {
      return {
        action: BookingActions.UNKNOWN,
        response: "I'm sorry, I didn't understand that. Can you please repeat?",
      };
    }
    const response = await openAI.chat.completions.create({
      model: OpenAIModel.GPT_3_5_TURBO_0125,
      messages: chats,
      response_format: { type: "json_object" },
    });

    const { choices } = response as ChatCompletion;
    const content = JSON.parse(choices[0].message.content ?? "[]");
    console.log("content: ", content);
    return content as IAppointmentReqData;
  };

  public textToAudio = async (text: string) => {
    return openAI.audio.speech.create({
      model: "tts-1",
      input: text,
      voice: "alloy",
    });
  };

  //   TODO: Improve the prompt
  protected buildPrompt = (promptObj: any): string => {
    let promptText: any = prompt;
    Object.keys(promptObj).forEach((key) => {
      promptText = promptText.replace(
        new RegExp(`{{${key}}}`, "g"),
        promptObj[key]
      );
    });
    return promptText;
  };

  protected buildConcurrentPrompts = (promptObj: any): string => {
    const { parsedPrompt } = promptObj;
    let promptText: any = concurrentPrompt;
    Object.keys(promptObj).forEach((key) => {
      promptText = promptText.replace(
        new RegExp(`{{${key}}}`, "g"),
        promptObj[key]
      );
    });
    return `${parsedPrompt}\n${promptText}`;
  };

  //   function to store only new values and retain the old ones
  // if the new ones are not present or are null/undefined
  protected holdNewVales = (oldObj: any, newObj: any) => {
    const result: any = {};
    for (const key in oldObj) {
      if (oldObj[key] !== undefined && oldObj[key] !== null) {
        result[key] = oldObj[key];
      }
    }

    for (const key in newObj) {
      if (newObj[key] !== undefined && newObj[key] !== null) {
        result[key] = newObj[key];
      }
    }

    return result;
  };

  protected removeNullAndUndefined = (obj: any) => {
    const result: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null) {
        result[key] = obj[key];
      }
    }
    return result;
  };

  public checkIfAllValuesArePresent = (obj: any) => {
    const keysRequired = [
      "user_name",
      "user_phone_number",
      "time",
      "date",
      "action",
      "response",
    ];

    for (const key of keysRequired) {
      if (obj[key] === undefined || obj[key] === null) {
        return false;
      }
    }
    return true;
  };

  public buildDoctorAvailabilitySlots = (doctorData: any) => {
    const { slots, bookings, working_days } = doctorData;
    const todayDate = moment().format("YYYY-MM-DD");
    const availableAppointments: any = [];
    const availableDays: any = [];
    // array of all the working days of the doctor in the next 7 days
    for (let i = 0; i < 7; i++) {
      const day = moment(todayDate).add(i, "days");
      const dayIndex = moment(day).day();
      const isWorkingDay = working_days[dayIndex];
      if (isWorkingDay) {
        availableDays.push(moment(day).format("YYYY-MM-DD"));
      }
    }

    availableDays.forEach((day: any) => {
      const findBookings = bookings.filter(
        (booking: any) => booking.date === day
      );
      const availableSlots = slots.filter(
        (slot: any) =>
          !findBookings.find((booking: any) => booking.slot === slot)
      );

      availableSlots.forEach((slot: any) => {
        availableAppointments.push({ date: day, slot });
      });
    });

    return availableAppointments;
  };
}
