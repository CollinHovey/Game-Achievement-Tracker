import React from 'react';
import UserContext from '../lib/user-context';
import ProfileAchievements from '../components/profile-achievements';
import ProfileFriends from '../components/profile-friends';
import ProfilePosts from '../components/profile-posts';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: 'initial',
      shadowOn: false,
      tab: 'posts'
    };
    this.handleOpenNav = this.handleOpenNav.bind(this);
    this.handleCloseNav = this.handleCloseNav.bind(this);
    this.handleClickPosts = this.handleClickPosts.bind(this);
    this.handleClickFriends = this.handleClickFriends.bind(this);
    this.handleClickAchievements = this.handleClickAchievements.bind(this);
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

  handleClickPosts() {
    this.setState({ tab: 'posts' });
  }

  handleClickFriends() {
    this.setState({ tab: 'friends' });
  }

  handleClickAchievements() {
    this.setState({ tab: 'achievements' });
  }

  render() {
    const { handleSignOut, handleHomeNav, handleFriendsNav, handleProfileNav } = this.context;
    // console.log('profile context', this.context);
    // console.log('profile context user', this.context.user);
    let tabRender = <ProfilePosts />;
    if (this.state.tab === 'friends') {
      tabRender = <ProfileFriends />;
    }
    if (this.state.tab === 'achievements') {
      tabRender = <ProfileAchievements />;
    }
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
          <div className={`shadow-${this.state.shadowOn}`} onClick={this.handleCloseNav}></div>
          <div className='header-container'>
            <div className='nav-container'>
              <i className="fa-solid fa-bars fa-2x" onClick={this.handleOpenNav}></i>
              <h1 className='header-title'>{this.context.user.username}</h1>
            </div>
            <button className='logout-button big-button' onClick={handleSignOut}>Log Out</button>
          </div>
          <ul className='profile-nav'>
            <li className='profile-nav-link' onClick={this.handleClickPosts}>Posts</li>
            <div className='profile-vertical-line'></div>
            <li className='profile-nav-link active-link' onClick={this.handleClickFriends}>Friends</li>
            <div className='profile-vertical-line'></div>
            <li className='profile-nav-link' onClick={this.handleClickAchievements}>Achievements</li>
          </ul>
          {tabRender}
        </>
      );
    }
  }

}

Profile.contextType = UserContext;
