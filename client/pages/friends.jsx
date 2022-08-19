import React from 'react';
import UserContext from '../lib/user-context';

export default class Friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: false,
      view: 'posts'
    };
  }

  render() {
    if (this.context.user === null) {
      window.location.hash = '#home';
    } else {
      return (
        <>
          <h1>Requests</h1>
          <h1>Friends</h1>
        </>
      );
    }
  }
}

Friends.contextType = UserContext;
