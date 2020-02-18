import * as Notifications from 'react-notification-system-redux';
import { Notification } from 'react-notification-system';

const notificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: 'Error!',
  message: 'Internal error',
  position: 'br',
  autoDismiss: 5,
};
export const sendNotification = (title: string, message?: string, type?: string) => {
  return (dispatch) => {
    notificationOpts.title = title.replace(/"/g, ' ');
    notificationOpts.message = message;
    switch (type) {
      case
        'info':
          dispatch(Notifications.info(notificationOpts as Notification));
          break;
      case
        'success':
          dispatch(Notifications.success(notificationOpts as Notification));
          break;
      default:
        dispatch(Notifications.error(notificationOpts as Notification));
        break;
    }
  };
};
