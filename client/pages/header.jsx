import React from 'react';
import UserContext from '../lib/user-context';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOn: false,
      navOpen: 'initial'
    };
    this.handleOpenNav = this.handleOpenNav.bind(this);
    this.handleCloseNav = this.handleCloseNav.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        navOpen: 'initial',
        shadowOn: false
      });
    });
  }

  handleOpenNav() {
    this.setState({
      navOpen: true,
      shadowOn: true
    });
  }

  handleCloseNav() {
    if (this.state.navOpen === true) {
      this.setState({
        navOpen: false,
        shadowOn: false
      });
    }
  }

  render() {
    // let profileName = '#home';
    let messages = <></>;
    let profile = <></>;
    if (this.context.user !== null) {
      // profileName = `#profile?userId=${this.context.user.userId}`;
      profile = <a className='nav-link' href={`#profile?userId=${this.context.user.userId}`}>Profile</a>;
      messages = <a className='nav-link' href={`#messages?userId=${this.context.user.userId}`}>Messages</a>;
    }
    const { handleSignOut } = this.context;
    let headerTitle = 'Welcome Guest!';
    let button = <a href='#login' id='login-button' className='big-button'>Login</a>;
    if (this.context.user !== null) {
      headerTitle = this.context.user.username;
      button = <button className='logout-button big-button' onClick={handleSignOut}>Log Out</button>;
    }
    return (
      <>
        <ul className={`nav-list-container-${this.state.navOpen}`}>
          <li className='nav-link'><i className="fa-solid fa-bars fa-2x" onClick={this.handleCloseNav}></i></li>
          <a className='nav-link' href='#home'>Home</a>
          {profile}
          {messages}
          {/* <a className='nav-link' href={profileName}>Profile</a> */}
        </ul>
        <div className={`shadow-${this.state.shadowOn}`} onClick={this.handleCloseNav}></div>
        <div className='header-container'>
          <div className='nav-container'>
            <i className="fa-solid fa-bars fa-2x" onClick={this.handleOpenNav}></i>
            <h1 className='header-title'>{headerTitle}</h1>
          </div>
          {button}
        </div>
      </>
    );
  }
}

Header.contextType = UserContext;
