import React from 'react';
import UserContext from '../lib/user-context';

export default class ProfileFriends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      requests: []
    };
    this.getFriends = this.getFriends.bind(this);
    this.getRequests = this.getRequests.bind(this);
    this.acceptRequest = this.acceptRequest.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
  }

  deleteRequest(senderId, index) {
    const tokenJSON = localStorage.getItem('token');
    fetch(`api/deleteRequest/${senderId}`, {
      method: 'DELETE',
      headers: {
        'X-Access-Token': tokenJSON
      }
    })
      .then(response => response.json()
        .then(data => {
          const newRequests = this.state.requests.slice();
          newRequests.splice(index, 1);
          this.setState({ requests: newRequests });
        })
      );
  }

  removeFriend(friendId, index) {
    const tokenJSON = localStorage.getItem('token');
    fetch(`api/removeFriend/${friendId}`, {
      method: 'DELETE',
      headers: {
        'X-Access-Token': tokenJSON
      }
    })
      .then(response => response.json()
        .then(data => {
          const newFriends = this.state.friends.slice();
          newFriends.splice(index, 1);
          this.setState({ friends: newFriends });
        })
      );
  }

  acceptRequest(sendId, sendUsername, index) {
    const tokenJSON = localStorage.getItem('token');
    fetch(`api/friendAccept/${sendId}`, {
      method: 'POST',
      headers: {
        'X-Access-Token': tokenJSON
      }
    })
      .then(response => response.json()
        .then(data => {
          const newRequests = this.state.requests.slice();
          const newFriends = this.state.friends.slice();
          newRequests.splice(index, 1);
          const newFriend = {
            friendId: data.friendId,
            friendUserId: sendId,
            friendUsername: sendUsername
          };
          newFriends.push(newFriend);
          this.setState({
            friends: newFriends,
            requests: newRequests
          });
        })
      );
  }

  getRequests() {
    const userId = this.context.user.userId;
    const tokenJSON = localStorage.getItem('token');
    fetch(`api/friendRequests/${userId}`, {
      method: 'GET',
      headers: {
        'X-Access-Token': tokenJSON
      }
    })
      .then(response => response.json()
        .then(data => {
          this.setState({ requests: data });
        })
      );
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

  componentDidMount() {
    this.getFriends();
    this.getRequests();
  }

  render() {
    const friendList = this.state.friends;
    const requestsList = this.state.requests;
    const requestListHTML = requestsList.map((sender, index) => {
      return (
        <div key={index} className='friend-container'>
          <hr className='games-container-line'></hr>
          <div className='requests-container'>
            <a className='friends-name' href={`#profile?userId=${sender.userId}`}>{sender.username}</a>
            <div className='requests-button-container'>
              <button className='requests-buttons' onClick={() => this.acceptRequest(sender.userId, sender.username, index)}>Accept</button>
              <button className='requests-buttons' onClick={() => this.deleteRequest(sender.userId, index)}>Decline</button>
            </div>
          </div>
        </div>
      );
    });
    let requestList = <></>;
    if (this.context.loggedIn) {
      if (this.context.user.userId === this.context.params) {
        requestList = <>
          <hr className='games-container-line'></hr>
          <h1 className='friends-list-header'>Friend Requests</h1>
          {requestListHTML}
        </>;
      }
    }
    const friendListHTML = friendList.map((friend, index) => {
      return (
        <div key={index} className='friend-container'>
          <hr className='games-container-line'></hr>
          <div className='requests-container'>
            <a className='friends-name' href={`#profile?userId=${friend.friendUserId}`}>{friend.friendUsername}</a>
            <button className='requests-buttons' onClick={() => this.removeFriend(friend.friendId, index)}>Remove Friend</button>
          </div>
        </div>
      );
    });
    return (
      <div className='content-container'>
        {requestList}
        <hr className='games-container-line'></hr>
        <h1 className='friends-list-header'>Friends</h1>
        {friendListHTML}
      </div>
    );
  }
}

ProfileFriends.contextType = UserContext;
