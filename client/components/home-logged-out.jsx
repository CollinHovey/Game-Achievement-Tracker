import React from 'react';
import UserContext from '../lib/user-context';

export default class HomeLoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOn: false,
      posts: null,
      searchPosts: null,
      searchEnter: '',
      search: ''
    };
    this.login = this.login.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleEndSearch = this.handleEndSearch.bind(this);
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

  handleSearch(event) {
    if (event.charCode === 13) {
      const posts = this.state.posts;
      const search = this.state.search;
      const searchPosts = [];
      for (let x = 0; x < posts.length; x++) {
        if (posts[x].topic === search) {
          searchPosts.push(posts[x]);
        }
      }
      this.setState({
        searchPosts,
        searchEnter: search
      });
    }
  }

  handleEndSearch() {
    this.setState({
      searchPosts: null,
      searchEnter: '',
      search: ''
    });
  }

  handleChangeSearch(event) {
    this.setState({ search: event.target.value });
  }

  login() {
    window.location.hash = '#login';
  }

  render() {
    let postsList = <h1>Loading Posts</h1>;
    let posts = this.state.posts;
    let cancelSearch = <div></div>;
    if (this.state.searchPosts !== null) {
      posts = this.state.searchPosts;
      cancelSearch = <>
        <div className='cancel-search-container'>
          <h1 className='cancel-search-button' onClick={this.handleEndSearch}>{this.state.searchEnter} <i className="fa-solid fa-x cancel-search-x"></i></h1>
          <h1 className='search-results-count'>{posts.length} result(s)</h1>
        </div>
        <hr className='post-line'></hr>
      </>;
    }
    if (this.state.posts !== null) {
      postsList = posts.map((post, index) => {
        return (
          <div key={index} className='post-container'>
            <div className='post-header'>
              <h1 className='post-topic'>{post.topic}</h1>
              <a href={`#profile?userId=${post.userId}`} className='post-username'>{post.username}</a>
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
            <input className='search-input' placeholder='Search' onKeyPress={this.handleSearch} value={this.state.search} onChange={this.handleChangeSearch}></input>
            </div>
            {cancelSearch}
            <div className='post-list-container-logged-out'>
              {postsList}
            </div>
          </div>
        </>
    );
  }

}

HomeLoggedOut.contextType = UserContext;
