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
      <>
        <h1>Welcome Back {this.context.username}!</h1>
        <button className='logout-button' onClick={handleSignOut}>Log Out</button>
      </>
    );
  }
}

HomeLoggedIn.contextType = UserContext;
