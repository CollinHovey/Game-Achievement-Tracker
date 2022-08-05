import React from 'react';
import UserContext from '../lib/user-context';

export default class ProfileAchievements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOn: false,
      newGame: '',
      games: null
    };
    this.handleNewGamePopup = this.handleNewGamePopup.bind(this);
    this.handleGameNameChange = this.handleGameNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNewGamePopup() {
    this.setState({ shadowOn: !this.state.shadowOn });
  }

  handleGameNameChange(event) {
    this.setState({ newGame: event.target.value });
  }

  handleSubmit(event) {
    const token = this.context.token;
    const tokenJSON = JSON.stringify(token);
    const gameName = { game: this.state.newGame };
    const games = this.context.games;
    // console.log(gameName);
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
          // this.setState({ games: data });
          // console.log('fetch games data', data);
          games.unshift(data[0]);
          this.context.games = games;
          // console.log(this.state.newGame);
          this.setState({ newGame: '' });
        })
      );
    this.setState({ shadowOn: !this.state.shadowOn });
  }

  render() {
    let games = this.state.games;
    if (this.state.games === null) {
      games = this.context.games;
    }
    // console.log('games', games);
    let gamesList = <p className='no-games'>You Have No Games Added</p>;
    if (games.length !== 0) {
      gamesList = games.map((game, index) => {
        return (
          <div key={game.gameId}>
            <hr className='games-container-line'></hr>
            <div className='game-entry-container'>
              <p className='profile-game-title'>{game.gameName}</p>
            </div>
            <hr className='games-container-line bottom-line'></hr>
          </div>
        );
      });
    }
    return (
      <>
        <div>
          <form onSubmit={this.handleSubmit} className={`newgame-form-${this.state.shadowOn}`}>
            <p className='p-no-margin'>New Game</p>
            <input placeholder='Super Mario Bros.' className='newgame-input' id='new-game-name' value={this.state.newGame} onChange={this.handleGameNameChange}></input>
            <div className='newgame-button-container'>
              <button className='big-button'>Cancel</button>
              <button className='big-button'>Submit</button>
            </div>
          </form>
        </div>
        <div className={`shadow-${this.state.shadowOn}`} onClick={this.handleNewGamePopup}></div>
        <div className='content-container'>
          <div className='games-container'>
            {gamesList}
            {/* <hr className='games-container-line'></hr>
            <div className='game-entry-container'>
              <p className='profile-game-title'>Example Game</p>
            </div>
            <hr className='games-container-line'></hr> */}
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
