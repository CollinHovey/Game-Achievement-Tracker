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
      <div className='header-container'>
        <h1 className='header-title'>Hello Guest!</h1>
        <button className='login-button big-button' onClick={this.login}>Log In</button>
      </div>
    );
  }
}

HomeLoggedOut.contextType = UserContext;
