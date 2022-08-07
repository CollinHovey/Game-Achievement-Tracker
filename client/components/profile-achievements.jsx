import React from 'react';
import UserContext from '../lib/user-context';

export default class ProfileAchievements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOn: false,
      gameOn: false,
      achOn: false,
      newGame: '',
      newAchievement: '',
      achDetails: '',
      gameId: null,
      index: null
    };
    this.handleNewGamePopup = this.handleNewGamePopup.bind(this);
    this.handleGameNameChange = this.handleGameNameChange.bind(this);
    this.handleSubmitGame = this.handleSubmitGame.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAchievementNameChange = this.handleAchievementNameChange.bind(this);
    this.handleAchievementDetailChange = this.handleAchievementDetailChange.bind(this);
    this.handleNewAchievementPopup = this.handleNewAchievementPopup.bind(this);
    this.handleSubmitAchievement = this.handleSubmitAchievement.bind(this);
  }

  handleAchievementNameChange(event) {
    this.setState({ newAchievement: event.target.value });
  }

  handleAchievementDetailChange(event) {
    this.setState({ achDetails: event.target.value });
  }

  handleNewAchievementPopup(gameId, index) {
    this.setState({
      shadowOn: !this.state.shadowOn,
      achOn: !this.state.achOn,
      gameId,
      index
    });
  }

  handleSubmitAchievement(event) {
    event.preventDefault();
    const token = this.context.token;
    const tokenJSON = JSON.stringify(token);
    const newData = {
      gameId: this.state.gameId,
      achName: this.state.newAchievement,
      achDetails: this.state.achDetails
    };
    const games = this.context.games;
    fetch('/api/achievements', {
      method: 'POST',
      headers: {
        'X-Access-Token': tokenJSON,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    })
      .then(response => response.json()
        .then(data => {
          const newAchievement = {
            achievementId: data.achievementId,
            achievementName: data.name,
            achievementDescription: data.description,
            achievementDate: data.dateCreated
          };
          const newGames = games.slice();
          newGames[this.state.index].achievements.unshift(newAchievement);
          this.context.games = newGames;
          this.setState({
            gameId: null,
            index: null,
            newAchievement: '',
            achDetails: ''
          });
        })
      );
    this.setState({
      shadowOn: !this.state.shadowOn,
      newAchievement: '',
      achDetails: '',
      achOn: false
    });
  }

  handleNewGamePopup() {
    this.setState({
      shadowOn: !this.state.shadowOn,
      gameOn: !this.state.gameOn
    });
  }

  handleGameNameChange(event) {
    this.setState({ newGame: event.target.value });
  }

  handleCancel(event) {
    event.preventDefault();
    this.setState({
      shadowOn: !this.state.shadowOn,
      newGame: '',
      newAchievement: '',
      achDetails: '',
      gameOn: false,
      achOn: false,
      index: null,
      gameId: null
    });
  }

  handleSubmitGame(event) {
    const token = this.context.token;
    const tokenJSON = JSON.stringify(token);
    const gameName = { game: this.state.newGame };
    const games = this.context.games;
    event.preventDefault();
    fetch('/api/games', {
      method: 'POST',
      headers: {
        'X-Access-Token': tokenJSON,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gameName)
    })
      .then(response => response.json()
        .then(data => {
          const newGames = games.slice();
          data.achievements = [];
          newGames.unshift(data);
          this.context.games = newGames;
          this.setState({ newGame: '' });
        })
      );
    this.setState({
      shadowOn: !this.state.shadowOn,
      newGame: '',
      gameOn: false
    });
  }

  render() {
    const games = this.context.games;
    let gamesList = <p className='no-games'>You Have No Games Added</p>;
    if (games.length !== 0) {
      gamesList = games.map((game, index) => {
        let achievementList = <p className='no-achievements'>You Have No Achievements For This Game</p>;
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
            <div className='add-achievement-container'>
              <p className='add-achievement-text' onClick={() => this.handleNewAchievementPopup(game.gameId, index)}>Add New Achievement</p>
              <i className="fa-solid fa-plus" onClick={() => this.handleNewAchievementPopup(game.gameId, index)}></i>
            </div>
            <hr className='games-container-line bottom-line'></hr>
          </div>
        );
      });
    }
    return (
      <>
        <div>
          <form onSubmit={this.handleSubmitGame} className={`newgame-form-${this.state.gameOn}`}>
            <p className='p-no-margin'>New Game</p>
            <input required placeholder='Super Mario Bros.' className='newgame-input' id='new-game-name' value={this.state.newGame} onChange={this.handleGameNameChange}></input>
            <div className='newgame-button-container'>
              <button className='big-button' onClick={this.handleCancel}>Cancel</button>
              <button className='big-button'>Submit</button>
            </div>
          </form>
        </div>
        <div>
          <form onSubmit={this.handleSubmitAchievement} className={`newachievement-form-${this.state.achOn}`}>
            <p className='p-no-margin'>New Achievement</p>
            <input required placeholder='Moons Collected' className='newachievement-input' id='new-achievement-name' value={this.state.newAchievement} onChange={this.handleAchievementNameChange}></input>
            <p className='p-no-margin'>Achievement Details</p>
            <input placeholder='43/694' className='newachievement-input' id='new-achievement-details' value={this.state.achDetails} onChange={this.handleAchievementDetailChange}></input>
            <div className='newgame-button-container'>
              <button className='big-button' onClick={this.handleCancel}>Cancel</button>
              <button className='big-button'>Submit</button>
            </div>
          </form>
        </div>
        <div className={`shadow-${this.state.shadowOn}`} onClick={this.handleCancel}></div>
        <div className='content-container'>
          <div className='games-container'>
            {gamesList}
            <div className='add-game-container'>
              <p className='add-game-text' onClick={this.handleNewGamePopup}>Add New Game</p>
              <i className="fa-solid fa-plus fa-2x" onClick={this.handleNewGamePopup}></i>
            </div>
          </div>
        </div>
      </>
    );
  }
}

ProfileAchievements.contextType = UserContext;
