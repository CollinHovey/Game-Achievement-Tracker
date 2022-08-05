import React from 'react';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Friends from './pages/friends';
import Profile from './pages/profile';
import parseRoute from './lib/parse-route';
import UserContext from './lib/user-context';
import jwtDecode from 'jwt-decode';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const tokenJSON = localStorage.getItem('token');
    const token = JSON.parse(tokenJSON);
    let user = null;
    if (token !== null) {
      user = jwtDecode(token);
    }
    this.state = {
      route: parseRoute(window.location.hash),
      user,
      achievements: null
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleHomeNav = this.handleHomeNav.bind(this);
    this.handleFriendsNav = this.handleFriendsNav.bind(this);
    this.handleProfileNav = this.handleProfileNav.bind(this);
  }

  handleSignIn(data) {
    const token = data.token;
    const user = data.user;
    localStorage.setItem('token', JSON.stringify(token));
    this.context = user;
  }

  handleSignOut() {
    window.localStorage.removeItem('token');
    if (this.state.route !== '#home') {
      window.location.hash = '#home';
    }
    this.setState({ user: null });
  }

  handleHomeNav() {
    // console.log('go to home');
    window.location.hash = '#home';
  }

  handleFriendsNav() {
    // console.log('go to friends');
    if (!this.state.user.userId) {
      window.location.hash = '#login';
    } else {
      window.location.hash = '#friends';
    }
  }

  handleProfileNav() {
    // console.log('go to profile');
    if (!this.state.user.userId) {
      window.location.hash = '#login';
    } else {
      window.location.hash = '#profile';
    }
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const route = parseRoute(window.location.hash);
      const tokenJSON = localStorage.getItem('token');
      const token = JSON.parse(tokenJSON);
      if (token !== null) {
        const user = jwtDecode(token);
        this.setState({ user });
      }
      this.setState({ route });
    });
    fetch('/api/achievements')
      .then(response => response.json()
        .then(data => {
          this.setState({ achievements: data });
        })
      );
  }

  renderPage() {
    const route = this.state.route;
    // console.log('route: ', route.path);
    if (route.path === 'login') {
      return <Login />;
    }
    if (route.path === 'signup') {
      return <Signup />;
    }
    if (route.path === 'home') {
      return <Home />;
    }
    if (route.path === 'friends') {
      return <Friends />;
    }
    if (route.path === 'profile') {
      return <Profile />;
    }
  }

  render() {
    const user = this.state.user;
    // console.log('app user', user);
    const { handleSignIn, handleSignOut, handleHomeNav, handleFriendsNav, handleProfileNav } = this;
    const contextValue = { handleSignIn, handleSignOut, user, handleHomeNav, handleFriendsNav, handleProfileNav };
    return (
      <UserContext.Provider value={contextValue}>
        <>
          {this.renderPage()}
        </>
      </UserContext.Provider>
    );
  }
}
