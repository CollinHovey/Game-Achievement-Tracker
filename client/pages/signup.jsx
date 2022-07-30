import React from 'react';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // console.log('rendered Login');
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    // console.log('username: ', this.state.username, 'password: ', this.state.password);
    this.setState({ username: '' });
    this.setState({ password: '' });
  }

  render() {
    return (
      <>
        <h1 className='not-logged-in-header'>Sign Up!</h1>
        <div className='signup-form-container'>
          <form className='signup-form' onSubmit={this.handleSubmit}>
            <label className='signup-label' htmlFor='signupUsername'>Username</label>
            <input required className='signup-input' id='signupUsername' value={this.state.username} onChange={this.handleUsernameChange}></input>
            <label className='signup-label' htmlFor='signupPassword'>Password</label>
            <input required className='signup-input' type='password' id='signupPassword' value={this.state.password} onChange={this.handlePasswordChange}></input>
            <div className='signup-button-container'>
              <button className='signup-button'>Sign Up</button>
              <a href='index.html#login' className='login-link'>Already have an account? Login!</a>
            </div>

          </form>
        </div>
      </>
    );
  }
}
