import React from 'react';
import UserContext from '../lib/user-context';

export default class ProfileAchievements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='content-container'>
        <div className='games-container'>
          <hr className='games-container-line'></hr>
          <div className='game-entry-container'>
            <p className='profile-game-title'>Example Game</p>
          </div>
          <hr className='games-container-line'></hr>
          <div className='add-game-container'>
            <p className='add-game-text'>Add New Game</p>
            <i className="fa-solid fa-plus fa-2x"></i>
          </div>
        </div>
      </div>
    );
  }
}

ProfileAchievements.contextType = UserContext;
