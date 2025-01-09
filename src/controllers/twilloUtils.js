const twilio=require('twilio')
const client = twilio(process.env.TWILIO_SID,process.env. TWILIO_AUTH_TOKEN);
const dotenv=require('dotenv')
const sendTwilioMessage = async (to, message) => {
    try {
      await client.messages.create({
        body: message,
        // from: '+12185304074', // Your Twilio phone number
        from: '+1218530404598558', // Your Twilio phone number
        to: to,
      });
      console.log(`Message sent successfully to ${to}`);
    } catch (error) {
      console.error(`Failed to send message to ${to}:`, error);
      throw error; // Rethrow the error for the calling function to handle
    }
  };
  module.exports = { sendTwilioMessage };