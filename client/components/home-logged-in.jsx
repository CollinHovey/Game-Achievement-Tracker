import React from 'react';
import UserContext from '../lib/user-context';

export default class HomeLoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    this.setState({ user: this.context.user.username });
  }

  render() {
    const postsList = <h1>hello</h1>;
    return (
      <>
        <div className='post-list'>
          {postsList}
        </div>
      </>
    );
  }
}

HomeLoggedIn.contextType = UserContext;
