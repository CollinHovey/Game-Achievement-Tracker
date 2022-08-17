import React from 'react';
import UserContext from '../lib/user-context';

export default class HomeLoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      shadowOn: false,
      topic: '',
      detail: '',
      posts: null
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleNewPostPopup = this.handleNewPostPopup.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);
    this.handleDetailChange = this.handleDetailChange.bind(this);
    this.handleSubmitPost = this.handleSubmitPost.bind(this);
  }

  componentDidMount() {
    this.setState({ user: this.context.user.username });
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

  handleCancel(event) {
    event.preventDefault();
    this.setState({ shadowOn: false });
  }

  handleNewPostPopup() {
    this.setState({ shadowOn: true });
  }

  handleTopicChange(event) {
    this.setState({ topic: event.target.value });
  }

  handleDetailChange(event) {
    this.setState({ detail: event.target.value });
  }

  handleSubmitPost(event) {
    event.preventDefault();
    const token = this.context.token;
    const tokenJSON = JSON.stringify(token);
    const newData = {
      topic: this.state.topic,
      detail: this.state.detail
    };
    fetch('/api/post', {
      method: 'POST',
      headers: {
        'X-Access-Token': tokenJSON,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    })
      .then(response => response.json()
        .then(data => {
          const posts = this.state.posts;
          const newPosts = posts.slice();
          const newPost = data;
          newPost.username = this.state.user;
          newPosts.unshift(newPost);
          this.setState({
            topic: '',
            detail: '',
            posts: newPosts
          });
        })
      );
    this.setState({
      shadowOn: false,
      topic: '',
      detail: ''
    });
  }

  render() {
    let postsList = <h1>hello</h1>;
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
        <div>
          <form onSubmit={this.handleSubmitPost} className={`newpost-form-${this.state.shadowOn}`}>
            <p className='p-no-margin'>Topic</p>
            <input required placeholder='Super Mario Oddessey' className='newpost-input' id='new-post-topic' value={this.state.topic} onChange={this.handleTopicChange}></input>
            <p className='p-no-margin'>Achievement Details</p>
            <textarea required placeholder='Comments' className='newpost-input' id='new-post-detail' value={this.state.detail} onChange={this.handleDetailChange}></textarea>
            <div className='newpost-button-container'>
              <button className='big-button' onClick={this.handleCancel}>Cancel</button>
              <button className='big-button'>Submit</button>
            </div>
          </form>
        </div>
        <div className={`shadow-${this.state.shadowOn}`} onClick={this.handleCancel}></div>
        <div className='post-list'>
          <div className='home-logged-in-header-container'>
            <input className='search-input' placeholder='Search'></input>
            <button className='new-post-button' onClick={this.handleNewPostPopup}>New Post</button>
          </div>
          {postsList}
        </div>
      </>
    );
  }
}

HomeLoggedIn.contextType = UserContext;
