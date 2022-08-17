import React from 'react';
import UserContext from '../lib/user-context';

export default class HomeLoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOn: false,
      posts: null
    };
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    fetch('/api/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json()
        .then(data => {
          this.setState({ posts: data });
        })
      );
  }

  login() {
    window.location.hash = '#login';
  }

  render() {
    let postsList = <h1>Loading Posts</h1>;
    const posts = this.state.posts;
    if (this.state.posts !== null) {
      postsList = posts.map((post, index) => {
        return (
            <div key={index} className='post-container'>
              <div className='post-header'>
                <h1 className='post-topic'>{post.topic}</h1>
                <h1 className='post-username'>{post.username}</h1>
              </div>
              <div className='caption-container'>
                <hr className='caption-line'></hr>
                <p className='post-caption'>{post.caption}</p>
              </div>
              <hr className='post-line'></hr>
            </div>
        );
      });
    }
    return (
        <>
          <div className='post-list'>
            <div className='home-logged-in-header-container'>
              <input className='search-input' placeholder='Search'></input>
            </div>
            {postsList}
          </div>
        </>
    );
  }

}

HomeLoggedOut.contextType = UserContext;
