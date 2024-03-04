# 🎙️ Voice Bot for Appointment Scheduling

Welcome to the Voice Bot for Appointment Scheduling project! This innovative bot allows seamless scheduling of appointments with doctors through voice commands.

## 📌 Project Description

The Voice Bot for Appointment Scheduling is designed to revolutionize the way patients book appointments with doctors. Leveraging advanced technologies like OpenAI for natural language processing and MongoDB for data storage, this bot simplifies the appointment scheduling process.

### Key Features:

- **Voice Interaction**: Users can schedule, reschedule, or cancel appointments with doctors using natural voice commands.
- **Real-time Communication**: WebSocket integration ensures real-time communication between users and the bot, providing instant responses.
- **Efficient Booking System**: The bot checks doctor availability and manages appointments efficiently, reducing manual effort.
- **State-of-the-Art Technologies**: Integration with OpenAI enables text-to-speech (TTS), speech-to-text (STT), and text generation capabilities, enhancing user experience.

### Why Choose Our Voice Bot?

- **Convenience**: Schedule appointments anytime, anywhere using voice commands.
- **Accuracy**: Ensure accurate scheduling with real-time availability checks.
- **Efficiency**: Streamline the appointment booking process for both users and healthcare providers.
- **User-Friendly**: Intuitive interface and natural language processing make scheduling appointments effortless.

## 🚀 Getting Started

Follow these simple steps to get started with the project:

1. **Clone the Repository**:

   ```
   git clone <repository_url>
   ```

2. **Navigate to the Project Directory**:

   ```
   cd <project_directory>
   ```

3. **Install Dependencies**:

   ```
   yarn install
   ```

4. **Set Environment Variables**:
   Create a `.env` file in the root directory of your project and add the following variables with their corresponding values:

   ```dotenv
   PORT=3000
   OPEN_AI_API_KEY=<your_openai_api_key>
   MONGO_URI=<your_mongo_db_uri>
   MONGO_DB=<your_mongo_db_name>
   ```

5. **Run the Code in Development Mode**:

   ```
   yarn dev
   ```

6. **Access the Application**:
   Once the server is running, you can access the application through the specified port in your browser or use WebSocket connections as needed.

## 🛠️ Tech Stack

- **Node.js**: Runtime environment for server-side execution.
- **Express**: Web framework for building robust APIs.
- **TypeScript**: Typed superset of JavaScript for enhanced development experience.
- **MongoDB**: Scalable NoSQL database for storing appointment data.
- **WebSocket**: Real-time communication protocol for interactive chat sessions.
- **OpenAI**: Integration for Text to Speech (TTS), Speech to Text (STT), and text generation.
- **Others**: Various dependencies for enhanced functionality.

## Example WebSocket Request

To send a voice command to schedule an appointment, you can use the following example WebSocket request:

- **URL**: `ws://localhost:3000?doctor_id=b9e18c60-0007-4a1f-ba74-20316b6cfe89&session_id=425b4116-1df9-4d49-8e4b-b4aa05899932`
- **Body**: Binary base64 encoded audio file

## 📖 Documentation

For detailed documentation and usage instructions, please visit [this link](https://sapphire-knife-101.notion.site/Walnut-Assignment-85807c605aee442bb5049969a3d32f50?pvs=4).

## 🌟 Get Started Now!

Experience the convenience of scheduling appointments through voice commands with our Voice Bot for Appointment Scheduling! Get started today and streamline your appointment booking process.
