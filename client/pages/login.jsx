import React from 'react';

class Login extends React.Component {
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
        <h1 className='not-logged-in-header'>Welcome, Login</h1>
        <div className='login-form-container'>
          <form className='login-form' onSubmit={this.handleSubmit}>
            <label className='login-label' htmlFor='loginUsername'>Username</label>
            <input required className='login-input' id='loginUsername' value={this.state.username} onChange={this.handleUsernameChange}></input>
            <label className='login-label' htmlFor='loginPassword'>Password</label>
            <input required className='login-input' type='password' id='loginPassword' value={this.state.password} onChange={this.handlePasswordChange}></input>
            <div className='login-button-container'>
              <button className='login-button'>Login</button>
              <a href='index.html#signup' className='signup-link'>{'Don\'t have and account? Sign up now!'}</a>
            </div>

          </form>
        </div>
      </>
    );
  }
}

export default Login;
