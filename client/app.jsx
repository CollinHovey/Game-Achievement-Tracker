import React from 'react';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Friends from './pages/friends';
import Profile from './pages/profile';
import Header from './pages/header';
import Messages from './pages/messages';
import parseRoute from './lib/parse-route';
import UserContext from './lib/user-context';
import jwtDecode from 'jwt-decode';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const tokenJSON = localStorage.getItem('token');
    const token = JSON.parse(tokenJSON);
    let user = null;
    let loggedIn = false;
    if (token !== null) {
      user = jwtDecode(token);
      loggedIn = true;
    }
    this.state = {
      route: parseRoute(window.location.hash),
      params: parseInt(parseRoute(window.location.hash).params.get('userId')),
      user,
      token,
      games: null,
      loggedIn
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleGetGames = this.handleGetGames.bind(this);
  }

  handleSignIn(data) {
    const token = data.token;
    const user = data.user;
    localStorage.setItem('token', JSON.stringify(token));
    this.setState({
      user,
      token,
      loggedIn: true
    });
    this.handleGetGames();
  }

  handleSignOut() {
    // if (this.state.route !== '#home') {
    //   window.location.hash = '#home';
    // }
    window.location.hash = '#home';
    window.localStorage.removeItem('token');
    this.setState({
      user: null,
      token: null,
      loggedIn: false
    });
  }

  handleGetGames() {
    const tokenJSON = localStorage.getItem('token');
    const token = JSON.parse(tokenJSON);
    if (token !== null) {
      fetch('/api/achievements', {
        method: 'GET',
        headers: {
          'X-Access-Token': tokenJSON
        }
      })
        .then(response => response.json()
          .then(data => {
            this.setState({ games: data });
          })
        );
    }
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const route = parseRoute(window.location.hash);
      const tokenJSON = localStorage.getItem('token');
      const token = JSON.parse(tokenJSON);
      if (token !== null) {
        const user = jwtDecode(token);
        this.setState({
          user,
          loggedIn: true
        });
      }
      this.setState({
        route,
        params: parseInt(route.params.get('userId'))
      });
    });
  }

  renderPage() {
    // console.log('loggedin', this.state.loggedIn);
    const route = this.state.route;
    if (route.path === 'login') {
      return <Login />;
    }
    if (route.path === 'signup') {
      return <Signup />;
    }
    if (route.path === 'home') {
      return (
        <>
          <Home />
        </>
      );
    }
    if (route.path === 'friends') {
      return (
        <>
          <Header />
          <Friends />
        </>
      );
    }
    if (route.path === 'profile') {
      return (
        <>
          <Header />
          <Profile />
        </>
      );
    }
    if (route.path === 'messages') {
      return (
        <>
          <Header />
          <Messages />
        </>
      );
    }
  }

  render() {
    const { user, games, token, route, params, loggedIn } = this.state;
    const { handleSignIn, handleSignOut, handleHomeNav, handleFriendsNav, handleProfileNav } = this;
    const contextValue = { loggedIn, params, route, handleSignIn, handleSignOut, user, handleHomeNav, handleFriendsNav, handleProfileNav, games, token };
    return (
      <UserContext.Provider value={contextValue}>
        <>
          {this.renderPage()}
        </>
      </UserContext.Provider>
    );
  }
}
