import React from 'react';
import UserContext from '../lib/user-context';

export default class Friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: false,
      view: 'posts'
    };
    this.handleOpenNav = this.handleOpenNav.bind(this);
    this.handleCloseNav = this.handleCloseNav.bind(this);
  }

  handleOpenNav() {
    // console.log('open nav');
    this.setState({ navOpen: true });
  }

  handleCloseNav() {
    // console.log('close nav');
    this.setState({ navOpen: false });
  }

  render() {
    const { handleSignOut, handleHomeNav, handleFriendsNav, handleProfileNav } = this.context;
    if (this.context.user === null) {
      window.location.hash = '#home';
    } else {
      return (
        <>
          <ul className={`nav-list-container-${this.state.navOpen}`}>
            <li className='nav-link'><i className="fa-solid fa-bars fa-2x" onClick={this.handleCloseNav}></i></li>
            <li className='nav-link' onClick={handleHomeNav}>Home</li>
            <li className='nav-link' onClick={handleFriendsNav}>Friends</li>
            <li className='nav-link' onClick={handleProfileNav}>Profile</li>
          </ul>
          <div className={`shadow-${this.state.navOpen}`} onClick={this.handleCloseNav}></div>
          <div className='header-container'>
            <div className='nav-container'>
              <i className="fa-solid fa-bars fa-2x" onClick={this.handleOpenNav}></i>
              <h1 className='header-title'>Welcome Back {this.context.user.username}!</h1>
            </div>
            <button className='logout-button big-button' onClick={handleSignOut}>Log Out</button>
          </div>
          <h1>Friends</h1>
        </>
      );
    }
  }
}

Friends.contextType = UserContext;