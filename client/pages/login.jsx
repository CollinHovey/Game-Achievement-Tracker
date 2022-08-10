import React from 'react';
import UserContext from '../lib/user-context';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      login: true
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const login = {
      username: this.state.username,
      password: this.state.password
    };
    fetch('/api/users/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(login)
    })
      .then(response => response.json()
        .then(data => {
          if (!data.error) {
            this.context.handleSignIn(data);
            window.location.hash = '#home';
            return data;
          } else {
            this.setState({ login: false });
          }
        }));
    this.setState({ username: '' });
    this.setState({ password: '' });
  }

  render() {
    return (
      <>
        <h1 className='not-logged-in-header'>Welcome, Login</h1>
        <div className='login-form-container'>
          <form className='login-form' onSubmit={this.handleSubmit}>
            <label className='login-label' htmlFor='loginUsername'>Username</label>
            <input required placeholder='MyUsername' className='login-input' id='loginUsername' value={this.state.username} onChange={this.handleUsernameChange}></input>
            <label className='login-label' htmlFor='loginPassword'>Password</label>
            <input required placeholder='MyPassword' className='login-input' type='password' id='loginPassword' value={this.state.password} onChange={this.handlePasswordChange}></input>
            <div className='login-button-container'>
              <p className={`isvalid-login-${this.state.login}`}>Login Invalid</p>
              <button id='login-button' className='big-button'>Login</button>
              <a href='#signup' className='signup-link'>{'Don\'t have and account? Sign up now!'}</a>
            </div>
          </form>
        </div>
      </>
    );
  }
}
Login.contextType = UserContext;

export default Login;
