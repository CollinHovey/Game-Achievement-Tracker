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
      chats: []
    };
    this.getFriends = this.getFriends.bind(this);
    this.sendChat = this.sendChat.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.changeFriend = this.changeFriend.bind(this);
    this.enterSendChat = this.enterSendChat.bind(this);
  }

  componentDidMount() {
    if (!this.context.loggedIn) {
      window.location.hash = '#home';
    }
    this.getFriends();
    socket.on('broadcast message', message => {
      let status = 'recieved';
      if (this.context.user.userId === message.sender) {
        status = 'sent';
      }
      let chatIndex = -1;
      const chat = this.state.chats.find((chat, index) => {
        chatIndex = index;
        return chat.chatId === message.friendId;
      });
      const newMessage = {
        message: message.message,
        senderId: message.sender,
        recipientId: message.recipient,
        friendId: message.friendId,
        status
      };
      const newRoomMessages = chat.messages.slice();
      newRoomMessages.unshift(newMessage);
      const newChats = this.state.chats.slice();
      newChats[chatIndex].messages = newRoomMessages;
      this.setState({ chats: newChats });
    });
  }

  enterSendChat(event) {
    if (event.key === 'Enter') {
      this.sendChat();
      this.setState({ message: '' });
    }
  }

  handleTextChange(event) {
    if (event.nativeEvent.inputType !== 'insertLineBreak') {
      this.setState({ message: event.target.value });
    }
  }

  changeFriend(friendUserId, index, friendId) {
    const tokenJSON = localStorage.getItem('token');
    const newFriends = this.state.friends.slice();
    for (let i = 0; i < newFriends.length; i++) {
      newFriends[i].isActive = false;
    }
    newFriends[index].isActive = true;

    if (!newFriends[index].inRoom) {
      socket.emit('join room', friendId);
      newFriends[index].inRoom = true;
      fetch(`/api/messages/${friendId}`, {
        method: 'GET',
        headers: {
          'X-Access-Token': tokenJSON
        }
      })
        .then(response => response.json()
          .then(data => {
            const newChat = {
              chatId: friendId,
              messages: data
            };
            const newChats = this.state.chats.slice();
            newChats.push(newChat);
            this.setState({ chats: newChats });
            const currentRecipient = {
              friendUserId,
              friendId
            };
            this.setState({
              friends: newFriends,
              currentRecipient
            });
          })
        );
    } else {
      const currentRecipient = {
        friendUserId,
        friendId
      };
      this.setState({
        friends: newFriends,
        currentRecipient
      });
    }
  }

  sendChat() {
    const tokenJSON = localStorage.getItem('token');
    if (this.state.currentRecipient !== null && this.state.message !== '') {
      const message = {
        message: this.state.message,
        sender: this.context.user.userId,
        recipient: this.state.currentRecipient.friendUserId,
        friendId: this.state.currentRecipient.friendId
      };
      socket.emit('chat message', message);
      fetch('/api/newMessage', {
        method: 'POST',
        headers: {
          'X-Access-Token': tokenJSON,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      })
        .then(response => response.json()
          .then(data => {
          })
        );
    }
    this.setState({ message: '' });
  }

  getFriends() {
    const userId = this.context.user.userId;
    const tokenJSON = localStorage.getItem('token');
    fetch(`/api/friends/${userId}`, {
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
    let activeChat = 0;
    if (this.state.currentRecipient) {
      activeChat = this.state.currentRecipient.friendId;
    }
    let friendsList = <h1>You don&apos;t have any friends added yet</h1>;
    if (this.state.friends.length > 0) {
      friendsList = this.state.friends.map((friend, index) => {
        return (
          <li key={index} className={`message-friend message-friend-active-${friend.isActive}`} onClick={() => this.changeFriend(friend.friendUserId, index, friend.friendId)}>{friend.friendUsername}</li>
        );
      });
    }
    let messageList = <></>;
    function isChat(chat) {
      return chat.chatId === activeChat;
    }
    if (this.state.chats.length > 0) {
      const chat = this.state.chats.find(isChat);
      messageList = chat.messages.map((message, index) => {
        if (message.status === 'sent') {
          return <p key={index} className='message-sent'>{message.message}</p>;
        } else {
          return <p key={index} className='message-recieved'>{message.message}</p>;
        }
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
            {messageList}
          </div>
          <div className='new-message'>
            <textarea onKeyPress={this.enterSendChat} className='new-message-input' value={this.state.message} onChange={this.handleTextChange}></textarea>
            <button className='send-message-button' onClick={this.sendChat}>Send</button>
          </div>
        </div>
      </div>
    );
  }
}

Messages.contextType = UserContext;
