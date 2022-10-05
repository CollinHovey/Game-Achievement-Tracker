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
          <a href={`#profile?userId=${sender.userId}`}>{sender.username}</a>
        </div>
      );
    });
    let requestList = <></>;
    if (this.context.loggedIn) {
      if (this.context.user.userId === this.context.params) {
        requestList = <>
          <hr className='games-container-line bottom-line'></hr>
          <h1>Friend Requests</h1>
          {requestListHTML}
        </>;
      }
    }
    const friendListHTML = friendList.map((friend, index) => {
      return (
        <div key={index} className='friend-container'>
          <a href={`#profile?userId=${friend.friendUserId}`}>{friend.friendUsername}</a>
        </div>
      );
    });
    return (
      <div className='content-container'>
        {requestList}
        {friendListHTML}
        <hr className='games-container-line bottom-line'></hr>
      </div>
    );
  }
}

ProfileFriends.contextType = UserContext;
