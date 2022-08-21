import React from 'react';
import UserContext from '../lib/user-context';

export default class ProfileHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <h1>hello</h1>
    );
  }
}

ProfileHeader.contextType = UserContext;
