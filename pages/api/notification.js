
import { Expo } from 'expo-server-sdk';

const expo = new Expo();



export default async function handler(req, res) {
  const { token, title,  message, data } = req.body;

  await sendPushNotification(token,title, message, data);

  res.status(200).json({ success: true });
}



const sendPushNotification = async (pushToken,title, message, data) => {
  // Check if the push token is valid
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error('Invalid push token:', pushToken);
    return;
  }

  // Create the notification object
  const notification = {
    to: pushToken,
    sound: 'default',
    title: title,
    body: message,
    data: data,
  };

  // Send the notification
  try {
    if(message){
      const response = await expo.sendPushNotificationsAsync([notification]);
      console.log("RESPOSE", response);
    }
  } catch (error) {
    console.error(error);
  }
};
