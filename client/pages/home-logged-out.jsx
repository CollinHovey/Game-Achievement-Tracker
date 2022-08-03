import React from 'react';
import UserContext from '../lib/user-context';

export default class HomeLoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.login = this.login.bind(this);
  }

  // componentDidMount() {
  //   console.log('logged out home page');
  // }

  login() {
    window.location.hash = '#login';
  }

  render() {
    return (
      <>
        <h1>Hello Guest!</h1>
        <button className='login-button' onClick={this.login}>Log In</button>
      </>
    );
  }
}

HomeLoggedOut.contextType = UserContext;
