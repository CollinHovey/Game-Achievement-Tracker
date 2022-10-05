import React from 'react';
import UserContext from '../lib/user-context';

export default class VisitorHeader extends React.Component {
  constructor(props) {
    super(props);
    // console.log('constructor', this.props);
    this.state = {
      areFriends: null,
      friendData: null
    };
    this.isFriend = this.isFriend.bind(this);
    this.addFriend = this.addFriend.bind(this);
  }

  componentDidMount() {
    this.isFriend();
    // const pageId = this.context.params;
    // let userId = -1;
    // if (this.context.user !== null) {
    //   userId = this.context.user.userId;
    // }
  }

  isFriend() {
    if (this.context.loggedIn) {
      fetch(`/api/isFriend/${this.context.user.userId}/${this.context.params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json()
          .then(data => {
            if (data.isActive === 1) {
              this.setState({
                areFriends: true,
                friendData: data
              });
            } else {
              this.setState({ areFriends: false });
            }
          })
        );
    }
  }

  addFriend() {
    const requestIds = {
      userId: this.context.user.userId,
      reciever: this.context.params
    };
    const token = this.context.token;
    const tokenJSON = JSON.stringify(token);
    fetch('/api/addFriend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': tokenJSON
      },
      body: JSON.stringify(requestIds)
    })
      .then(response => response.json()
        .then(data => {
        })
      );
  }

  render() {
    let button = <></>;
    if (this.context.loggedIn) {
      button = <button onClick={this.addFriend}>Add Friend</button>;
      if (this.state.areFriends) {
        button = <button>Message Friend</button>;
      }
    }

    // console.log('props', this.props);
    let user = 'Welcome';
    if (this.props.user !== null) {
      user = this.props.user.user.username;
    }
    // console.log('render props', this.props.user);
    return (
      <div className='profile-header-visitor'>
        <h1>{user}</h1>
        {button}
      </div>
    );
  }
}

VisitorHeader.contextType = UserContext;
