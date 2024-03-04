import * as dotenv from "dotenv";
dotenv.config();
import express, { Application, Response, Request } from "express";
import cors from "cors";
import morgan from "morgan";
import url from "url";

import WebSocket, { WebSocketServer } from "ws";
import { AppointmentBookingController } from "./appointments/controller";
import { connectToDatabase } from "./config/mongo.config";
import { Socket } from "./appointments/enums/openai";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/**
 * @description to create a websocket server
 * @param {Server} wss
 */
const wss = new WebSocketServer({
  noServer: true,
});

connectToDatabase();

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Welcome to the appointment booking bot",
  });
});

const PORT = process.env.PORT || 5000;

const soc = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

soc.on(Socket.UPGRADE, (request, socket, head) => {
  socket.on(Socket.ERROR, onSocketPreError);
  wss.handleUpgrade(request, socket, head, (ws) => {
    socket.removeListener(Socket.ERROR, onSocketPreError);
    wss.emit(Socket.CONNECTION, ws, request);
  });
  socket.on(Socket.ERROR, onSocketPostError);
});

wss.on(Socket.CONNECTION, (ws: WebSocket, req) => {
  ws.on(Socket.MESSAGE, async (message: any) => {
    const parsedUrl = url.parse(req.url ?? "", true);
    const doctorId = parsedUrl.query.doctor_id;
    const sessionId = parsedUrl.query.session_id;
    if (!doctorId || !sessionId || !message) {
      ws.send(
        JSON.stringify({
          success: false,
          message: "doctor_id and session_id are required",
        })
      );
      return;
    }
    const responseData =
      (await new AppointmentBookingController().bookingSocketController({
        audioBuffer: message,
        doctor_id: doctorId as string,
        session_id: sessionId as string,
      })) as any;

    ws.send(responseData?.audio);
  });

  ws.on(Socket.CLOSE, () => {
    console.log("disconnected");
  });
});

wss.on(Socket.ERROR, (error) => {
  console.log("error: ", error);
});

const onSocketPreError = (error: any) => {
  console.log("error: ", error);
};

const onSocketPostError = (error: any) => {
  console.log("error: ", error);
};
