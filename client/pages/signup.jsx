import React from 'react';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: ''
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const signUp = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    };
    fetch('/api/users/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signUp)
    });
    this.setState({ username: '' });
    this.setState({ password: '' });
    this.setState({ email: '' });
    window.location.hash = '#login';
  }

  render() {
    return (
      <>
        <h1 className='not-logged-in-header'>Sign Up!</h1>
        <div className='signup-form-container'>
          <form className='signup-form' onSubmit={this.handleSubmit}>
            <label className='signup-label' htmlFor='signupUsername'>Username</label>
            <input required placeholder='MyUsername' className='signup-input' id='signupUsername' value={this.state.username} onChange={this.handleUsernameChange}></input>
            <label className='signup-label' htmlFor='signupPassword'>Password</label>
            <input required placeholder='MyPassword' className='signup-input' type='password' id='signupPassword' value={this.state.password} onChange={this.handlePasswordChange}></input>
            <label className='signup-label' htmlFor='email'>Email</label>
            <input required placeholder='MyEmail' className='signup-input' type='email' id='email' value={this.state.email} onChange={this.handleEmailChange}></input>
            <div className='signup-button-container'>
              <button className='signup-button big-button'>Sign Up</button>
              <a href='#login' className='login-link'>Already have an account?</a>
              <a href='#login' className='login-link'>Login!</a>
            </div>
          </form>
        </div>
      </>
    );
  }
}
