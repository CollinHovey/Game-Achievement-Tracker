import React from 'react';
import UserContext from '../lib/user-context';

export default class HomeLoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ''
    };
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.setState({ user: this.context.user });
  }

  logout() {
    localStorage.removeItem('token');
    this.setState({ user: '' });
    window.location.hash = '#home';
  }

  render() {
    // console.log('context', this.context);
    return (
      <>
        <h1>Welcome Back {this.context.user.username}!</h1>
        <button className='logout-button' onClick={this.logout}>Log Out</button>
      </>
    );
  }
}

HomeLoggedIn.contextType = UserContext;
