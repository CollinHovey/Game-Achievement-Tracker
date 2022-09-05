import React from 'react';
import UserContext from '../lib/user-context';

export default class VisitorHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let user = 'Welcome';
    if (this.props.user !== null) {
      user = this.props.user.user;
    }
    return (
      <div className='profile-header-visitor'>
        <h1>{user.username}</h1>
      </div>
    );
  }
}

VisitorHeader.contextType = UserContext;
