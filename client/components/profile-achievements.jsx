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
      index: null,
      submitType: null,
      achId: null,
      achIndex: null
    };
    this.handleNewGamePopup = this.handleNewGamePopup.bind(this);
    this.handleGameNameChange = this.handleGameNameChange.bind(this);
    this.handleSubmitGame = this.handleSubmitGame.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAchievementNameChange = this.handleAchievementNameChange.bind(this);
    this.handleAchievementDetailChange = this.handleAchievementDetailChange.bind(this);
    this.handleNewAchievementPopup = this.handleNewAchievementPopup.bind(this);
    this.handleSubmitAchievement = this.handleSubmitAchievement.bind(this);
    this.handleEditGamePopup = this.handleEditGamePopup.bind(this);
    this.handleEditAchievementPopup = this.handleEditAchievementPopup.bind(this);
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
      index,
      submitType: 'post'
    });
  }

  handleEditAchievementPopup(gameId, gameIndex, achievementId, achievementIndex, achName, achDetails) {
    this.setState({
      shadowOn: !this.state.shadowOn,
      achOn: !this.state.achOn,
      gameId,
      index: gameIndex,
      submitType: 'patch',
      newAchievement: achName,
      achDetails,
      achId: achievementId,
      achIndex: achievementIndex
    });
  }

  handleSubmitAchievement(event) {
    event.preventDefault();
    const request = this.state.submitType;
    const token = this.context.token;
    const tokenJSON = JSON.stringify(token);
    const newData = {
      gameId: this.state.gameId,
      achName: this.state.newAchievement,
      achDetails: this.state.achDetails
    };
    const games = this.context.games;
    if (request === 'post') {
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
        achOn: false,
        submitType: null,
        achId: null,
        achIndex: null
      });
    }
    if (request === 'patch') {
      const index = this.state.index;
      const achIndex = this.state.achIndex;
      if (this.state.newAchievement === games[index].achievements[achIndex].achievementName && this.state.achDetails === games[index].achievements[achIndex].achievementDescription) {
        this.setState({
          shadowOn: !this.state.shadowOn,
          newAchievement: '',
          achDetails: '',
          achOn: false,
          index: null,
          gameId: null,
          submitType: null,
          achId: null,
          achIndex: null
        });
        return;
      }
      newData.achievementId = this.state.achId;
      fetch('/api/achievements', {
        method: 'PATCH',
        headers: {
          'X-Access-Token': tokenJSON,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      })
        .then(response => response.json()
          .then(data => {
            const newGames = games.slice();
            newGames[index].achievements[achIndex].achievementName = data.name;
            newGames[index].achievements[achIndex].achievementDescription = data.description;
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
        achOn: false,
        submitType: null,
        achId: null,
        achIndex: null
      });
    }
  }

  handleNewGamePopup() {
    this.setState({
      shadowOn: !this.state.shadowOn,
      gameOn: !this.state.gameOn,
      submitType: 'post'
    });
  }

  handleEditGamePopup(gameId, index, gameName) {
    this.setState({
      shadowOn: !this.state.shadowOn,
      gameOn: !this.state.gameOn,
      newGame: gameName,
      gameId,
      index,
      submitType: 'patch'
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
      gameId: null,
      submitType: null
    });
  }

  handleSubmitGame(event) {
    event.preventDefault();
    const request = this.state.submitType;
    const token = this.context.token;
    const tokenJSON = JSON.stringify(token);
    const gameName = { game: this.state.newGame };
    const games = this.context.games;
    if (request === 'post') {
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
        gameOn: false,
        gameId: null,
        index: null,
        submitType: null
      });
    }
    const index = this.state.index;
    if (request === 'patch') {
      if (this.state.newGame === games[index].gameName) {
        this.setState({
          shadowOn: !this.state.shadowOn,
          newGame: '',
          newAchievement: '',
          achDetails: '',
          gameOn: false,
          achOn: false,
          index: null,
          gameId: null,
          submitType: null
        });
        return;
      }
      const game = {
        game: this.state.newGame,
        gameId: this.state.gameId
      };
      fetch('/api/games', {
        method: 'PATCH',
        headers: {
          'X-Access-Token': tokenJSON,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
      })
        .then(response => response.json()
          .then(data => {
            const newGames = games.slice();
            newGames[index].gameName = data.gameName;
            this.context.games = newGames;
            this.setState({ newGame: '' });
          })
        );
      this.setState({
        shadowOn: !this.state.shadowOn,
        gameOn: false,
        index: null,
        gameId: null,
        submitType: null
      });
    }
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
                  <i className="fa-solid fa-pencil edit-achievement-pencil" onClick={() => this.handleEditAchievementPopup(game.gameId, index, achievements.achievementId, indexAchievements, achievements.achievementName, achievements.achievementDescription)}></i>
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
              <i className="fa-solid fa-pencil edit-game-pencil" onClick={() => this.handleEditGamePopup(game.gameId, index, game.gameName)}></i>
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
