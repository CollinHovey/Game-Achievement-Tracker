import React from 'react';
import UserContext from '../lib/user-context';

export default class VisitorAchievements extends React.Component {
  render() {
    const games = this.props.games.games;
    let gamesList = <p className='no-games'>They Have No Games Added</p>;
    if (games.length !== 0) {
      gamesList = games.map((game, index) => {
        let achievementList = <p className='no-achievements'>They Have No Achievements For This Game</p>;
        if (games[index].achievements.length !== 0) {
          achievementList = games[index].achievements.map((achievements, indexAchievements) => {
            return (
              <div className='achievement-entry-container' key={achievements.achievementId}>
                <hr className='achievement-container-line'></hr>
                <div className='achievement-content-container'>
                  <p className='achievement-title'>{achievements.achievementName}</p>
                  <p className='achievement-detail'>{achievements.achievementDescription}</p>
                </div>
              </div>
            );
          });
        }
        return (
          <div key={game.gameId}>
            <hr className='games-container-line'></hr>
            <div className='game-entry-container'>
              <p className='profile-game-title'>{game.gameName}</p>
            </div>
            <div className='achievements-container'>
              {achievementList}
              <hr className='achievement-container-line'></hr>
            </div>
            <hr className='games-container-line bottom-line'></hr>
          </div>
        );
      });
    }
    return (
      <>
        <div className='content-container'>
          <div className='games-container'>
            {gamesList}
          </div>
        </div>
      </>
    );
  }
}

VisitorAchievements.contextType = UserContext;
