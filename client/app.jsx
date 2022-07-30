import React from 'react';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import parseRoute from './lib/parse-route';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };

  }

  componentDidMount() {
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
      <>
        { this.renderPage() }
      </>
    );
  }
}
