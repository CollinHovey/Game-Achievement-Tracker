import React from 'react';
import UserContext from '../lib/user-context';
import { io } from 'socket.io-client';
const socket = io();

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      message: '',
      currentRecipient: null,
      messages: []
    };
    this.getFriends = this.getFriends.bind(this);
    this.sendChat = this.sendChat.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.changeFriend = this.changeFriend.bind(this);
  }

  componentDidMount() {
    if (!this.context.loggedIn) {
      window.location.hash = '#home';
    }
    this.getFriends();
    // console.log('start chat');
  }

  handleTextChange(event) {
    this.setState({ message: event.target.value });
  }

  changeFriend(friendUserId, index, friendId) {
    // console.log(friendUserId);
    // console.log('change friend');
    const newFriends = this.state.friends.slice();
    for (let i = 0; i < newFriends.length; i++) {
      newFriends[i].isActive = false;
    }
    newFriends[index].isActive = true;
    this.setState({
      friends: newFriends,
      currentRecipient: friendUserId
    });
    socket.emit('join room', friendId);
  }

  sendChat() {
    // console.log('send chat', this.state.message);
    if (this.state.currentRecipient !== null) {
      const message = {
        message: this.state.message,
        sender: this.context.user.userId,
        recipient: this.state.currentRecipient
      };
      socket.emit('chat message', message);
    }
    this.setState({ message: '' });
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
          for (let i = 0; i < data.length; i++) {
            data[i].isActive = false;
          }
          this.setState({ friends: data });
        })
      );
  }

  render() {
    let friendsList = <h1>You don&apos;t have any friends added yet</h1>;
    if (this.state.friends.length > 0) {
      friendsList = this.state.friends.map((friend, index) => {
        return (
          <li key={index} className={`message-friend message-friend-active-${friend.isActive}`} onClick={() => this.changeFriend(friend.friendUserId, index, friend.friendId)}>{friend.friendUsername}</li>
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
          </div>
          <div className='new-message'>
            <textarea className='new-message-input' value={this.state.message} onChange={this.handleTextChange}></textarea>
            <button className='send-message-button' onClick={this.sendChat}>Send</button>
          </div>
        </div>
      </div>
    );
  }
}

Messages.contextType = UserContext;
