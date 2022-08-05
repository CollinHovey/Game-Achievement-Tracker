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
      tab: 'posts',
      posts: true,
      friends: false,
      achievements: false
    };
    this.handleClickPosts = this.handleClickPosts.bind(this);
    this.handleClickFriends = this.handleClickFriends.bind(this);
    this.handleClickAchievements = this.handleClickAchievements.bind(this);
  }

  handleClickPosts() {
    this.setState({
      tab: 'posts',
      posts: true,
      friends: false,
      achievements: false
    });
  }

  handleClickFriends() {
    this.setState({
      tab: 'friends',
      posts: false,
      friends: true,
      achievements: false
    });
  }

  handleClickAchievements() {
    this.setState({
      tab: 'achievements',
      posts: false,
      friends: false,
      achievements: true
    });
  }

  render() {
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
          <ul className='profile-nav'>
            <li className={`profile-nav-link active-${this.state.posts}`} onClick={this.handleClickPosts}>Posts</li>
            <div className='profile-vertical-line'></div>
            <li className={`profile-nav-link active-${this.state.friends}`} onClick={this.handleClickFriends}>Friends</li>
            <div className='profile-vertical-line'></div>
            <li className={`profile-nav-link active-${this.state.achievements}`} onClick={this.handleClickAchievements}>Achievements</li>
          </ul>
          {tabRender}
        </>
      );
    }
  }

}

Profile.contextType = UserContext;
