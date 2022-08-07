import React from 'react';
import UserContext from '../lib/user-context';

export default class HomeLoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = { navOpen: 'initial' };
    this.login = this.login.bind(this);
  }

  login() {
    window.location.hash = '#login';
  }

  render() {
    return (
      <>
      </>
    );
  }
}

HomeLoggedOut.contextType = UserContext;
