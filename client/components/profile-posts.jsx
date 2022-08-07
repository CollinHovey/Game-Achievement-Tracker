import React from 'react';
import UserContext from '../lib/user-context';

export default class ProfilePosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='content-container'>
        <h1>Posts</h1>
      </div>
    );
  }
}

ProfilePosts.contextType = UserContext;
