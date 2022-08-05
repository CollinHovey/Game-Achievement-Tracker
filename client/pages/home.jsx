import React from 'react';
import HomeLoggedIn from '../components/home-logged-in';
import HomeLoggedOut from '../components/home-logged-out';
import UserContext from '../lib/user-context';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    // console.log('home context', this.context);
    if (this.context.user !== null) {
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
