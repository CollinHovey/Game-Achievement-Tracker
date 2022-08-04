import React from 'react';
import UserContext from '../lib/user-context';

export default class HomeLoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }

  componentDidMount() {
    this.setState({ user: this.context.user });
  }

  render() {
    // console.log(this.context);
    const { handleSignOut } = this.context;
    return (
      <div className='header-container'>
        <h1 className='header-title'>Welcome Back {this.context.username}!</h1>
        <button className='logout-button big-button' onClick={handleSignOut}>Log Out</button>
      </div>
    );
  }
}

HomeLoggedIn.contextType = UserContext;
