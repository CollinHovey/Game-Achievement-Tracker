import React from 'react';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import parseRoute from './lib/parse-route';
import UserContext from './lib/user-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      token: JSON.parse(localStorage.getItem('token'))
    };
  }

  componentDidMount() {
    const tokenJSON = localStorage.getItem('token');
    const token = JSON.parse(tokenJSON);
    if (token !== null) {
      this.setState({ token });
    }
    window.addEventListener('hashchange', () => {
      const route = parseRoute(window.location.hash);
      this.setState({ route });
    });
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
    return (
      <UserContext.Provider value={this.state.token}>
        <>
          {this.renderPage()}
        </>
      </UserContext.Provider>
    );
  }
}
