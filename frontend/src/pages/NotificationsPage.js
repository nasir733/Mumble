import React, { useEffect, useRef } from 'react';
import '../styles/components/NotificationPage.css';

import { Card } from '../common';
import { Notification, Page } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications } from '../actions/notificationsActions';
import { w3cwebsocket } from 'websocket';
import { func } from 'prop-types';

function NotificationsPage() {
  const { notifications } = useSelector((state) => state.notifications.notifications);
  const chatSocket = useRef(null);
  const dispatch = useDispatch();
  const setupWebsocket = () => {
    console.log('seting up notifications websocket ');
    chatSocket.current = new w3cwebsocket(
      `${process.env.REACT_APP_WEBSOCKET_ENDPOINT}/?token=${localStorage.getItem('access')}`,
    );
  };
  const onOpen = () => {
    console.log('chatsocket opened ');
    chatSocket.current.send(
      JSON.stringify({
        command: 'get_notifications',
      }),
    );
    console.log('sent the chat socket message');
  };
  const onMessage = (message) => {
    console.log('got websocket message');
    let data = JSON.parse(message.data);

    dispatch(getNotifications(data));
    console.log(data);
    // console.log(message);
  };

  useEffect(() => {
    setupWebsocket();
    chatSocket.current.onopen = onOpen;
    chatSocket.current.onmessage = onMessage;
  }, []);

  return (
    <Page singleContent={true}>
      <section>
        <Card>
          <div className="notification">
            <h5>All Notifications</h5>
          </div>
          {notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
          ))}
          {notifications.length === 0 && (
            <div>You have no notifications! Start following some Mumblers</div>
          )}
        </Card>
      </section>
    </Page>
  );
}

export default NotificationsPage;
