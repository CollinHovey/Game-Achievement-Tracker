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
        <div className='header-container'>
          <div className='nav-container'>
            <h1 className='header-title'>Hello Guest!</h1>
          </div>
          <button className='logout-button big-button' onClick={this.login}>Login</button>
        </div>
      </>
    );
  }
}

HomeLoggedOut.contextType = UserContext;
