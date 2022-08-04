import React from 'react';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
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
      user
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignIn(data) {
    const token = data.token;
    const user = data.user;
    // console.log('login token', token, 'login user', user);
    localStorage.setItem('token', JSON.stringify(token));
    this.context = user;
  }

  handleSignOut() {
    window.localStorage.removeItem('token');
    this.setState({ user: null });
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
    // window.addEventListener('storage', () => {
    //   const tokenJSON = localStorage.getItem('token');
    //   const token = JSON.parse(tokenJSON);
    //   this.setState({ token });
    //   console.log('storage change');
    // });
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
  }

  render() {
    const user = this.state.user;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { handleSignIn, handleSignOut, user };
    return (
      <UserContext.Provider value={contextValue}>
        <>
          {this.renderPage()}
        </>
      </UserContext.Provider>
    );
  }
}
