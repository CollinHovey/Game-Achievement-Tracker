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
        navOpen: false,
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
    this.setState({
      navOpen: false,
      shadowOn: false
    });
  }

  render() {
    const { handleSignOut } = this.context;
    return (
      <>
        <ul className={`nav-list-container-${this.state.navOpen}`}>
          <li className='nav-link'><i className="fa-solid fa-bars fa-2x" onClick={this.handleCloseNav}></i></li>
          <a className='nav-link' href='#home'>Home</a>
          <a className='nav-link' href='#friends'>Friends</a>
          <a className='nav-link' href='#profile'>Profile</a>
        </ul>
        <div className={`shadow-${this.state.shadowOn}`} onClick={this.handleCloseNav}></div>
        <div className='header-container'>
          <div className='nav-container'>
            <i className="fa-solid fa-bars fa-2x" onClick={this.handleOpenNav}></i>
            <h1 className='header-title'>{this.context.user.username}</h1>
          </div>
          <button className='logout-button big-button' onClick={handleSignOut}>Log Out</button>
        </div>
      </>
    );
  }
}

Header.contextType = UserContext;
