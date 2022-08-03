import React from 'react';
import HomeLoggedIn from './home-logged-in';
import HomeLoggedOut from './home-logged-out';
import UserContext from '../lib/user-context';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: JSON.parse(localStorage.getItem('token')) };
  }

  render() {
    // console.log('loggedin', this.state.loggedIn);
    if (this.state.loggedIn) {
      return (
        <>
          <HomeLoggedIn />
        </>
      );
    } else {
      return (
        <>
          <HomeLoggedOut />
        </>
      );
    }
  }
}

Home.contextType = UserContext;
