import React from 'react';
import HomeLoggedIn from '../components/home-logged-in';
import HomeLoggedOut from '../components/home-logged-out';
import Header from './header';
import UserContext from '../lib/user-context';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    if (this.context.user !== null) {
      return (
        <>
          <Header />
          <HomeLoggedIn />
        </>
      );
    } else {
      return (
        <>
          <Header />
          <HomeLoggedOut />
        </>
      );
    }
  }
}

Home.contextType = UserContext;
