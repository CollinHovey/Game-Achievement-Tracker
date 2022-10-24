import React from 'react';
import UserContext from '../lib/user-context';

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // console.log('logged in', this.context.loggedIn);
    // if (!this.context.loggedIn) {
    //   window.location.hash = '#home';
    // }
  }

  render() {
    return (
      <h1>Messages</h1>
    );
  }
}

Messages.contextType = UserContext;
