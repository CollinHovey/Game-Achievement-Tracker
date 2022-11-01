import React from 'react';
import UserContext from '../lib/user-context';
// import { io } from 'socket.io-client';

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: []
    };
    this.getFriends = this.getFriends.bind(this);
    this.startChat = this.startChat.bind(this);
  }

  componentDidMount() {
    // console.log('logged in', this.context.loggedIn);
    if (!this.context.loggedIn) {
      window.location.hash = '#home';
    }
    this.getFriends();
  }

  startChat() {
    // console.log('start chat');
    // const socket = io();
  }

  getFriends() {
    const userId = this.context.user.userId;
    const tokenJSON = localStorage.getItem('token');
    fetch(`api/friends/${userId}`, {
      method: 'GET',
      headers: {
        'X-Access-Token': tokenJSON
      }
    })
      .then(response => response.json()
        .then(data => {
          this.setState({ friends: data });
        })
      );
  }

  render() {
    let friendsList = <h1>You don&apos;t have any friends added yet</h1>;
    if (this.state.friends.length > 0) {
      friendsList = this.state.friends.map((friend, index) => {
        return (
          <li key={index} className='message-friend'>{friend.friendUsername}</li>
        );
      });
    }
    return (
      <div className='message-container'>
        <div className='message-friends-container'>
          <h1>Friends</h1>
          <ul className='message-friends-list'>
            {friendsList}
          </ul>
        </div>
        <div className='messaging-container'>
          <div className='messages'>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
            <p className='message-recieved'>Hey Chief, what you doing</p>
            <p className='message-sent'>Nothing much</p>
          </div>
          <div className='new-message'>
            <textarea className='new-message-input' ></textarea>
            <button className='send-message-button' onClick={this.startChat}>Send</button>
          </div>
        </div>
      </div>
    );
  }
}

Messages.contextType = UserContext;
