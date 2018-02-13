import React from "react";
import socketIOClient from "socket.io-client";
import './App.css';

const DEFAULT_AVATAR_URL = 'https://pbs.twimg.com/media/C8fPgCGU0AABzPa.jpg'

// const endpoint = 'http://localhost:4001'
const endpoint = 'https://cryptic-plains-73206.herokuapp.com/'

const room = window.location.hash ? window.location.hash.substr(1) : 'general'
const socket = socketIOClient(endpoint, { query: `room=${room}`})

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      avatarUrl: '',
      avatarUrlInput: '',
      chat: [],
      editingAvatar: false,
      input: ''
    }
    socket.on('update chat', chat => {
      console.log('received chat data', chat)
      this.setState({chat})
    })
    this.onInputChange = this.onInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onAvatarUrlInputChange = this.onAvatarUrlInputChange.bind(this)
    this.toggleEditingAvatarUrl = this.toggleEditingAvatarUrl.bind(this)
    this.setAvatarUrl = this.setAvatarUrl.bind(this)
    this.onEnterPress = this.onEnterPress.bind(this)
  }

  setAvatarUrl() {
    this.setState({
      avatarUrl: this.state.avatarUrlInput,
      editingAvatar: false,
      avatarUrlInput: ''
    })
  }

  toggleEditingAvatarUrl() {
    this.setState({ editingAvatar: !(this.state.editingAvatar) })
  }

  onAvatarUrlInputChange(event) {
    this.setState({ avatarUrlInput: event.target.value })
  }

  onInputChange(event) {
    this.setState({ input: event.target.value })
  }

  onEnterPress(event) {
    if(event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      this.onSubmit()
    }
  }

  onSubmit(event) {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    const body = this.state.input
    const nickname = ''
    const avatarUrl = this.state.avatarUrl
    socket.emit('data', { body, nickname, avatarUrl })
    this.setState({ input: '' })
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="messages">
          {this.state.chat.map((message, i) =>
            <div className={i%2 === 0 ? "message white" : "message lightblue"} key={`chat-${message.id}`}>
              <img
                ref={message.id}
                alt="avatar"
                className="avatar"
                src={message.avatar}
                onError={(e) => {this.refs[message.id].src = DEFAULT_AVATAR_URL}}
              />
              <span className="message-body">{message.body}</span>
            </div>)
          }
        </div>
        <div className="message-input">
          { this.state.editingAvatar ?
            <div className="avatar-edit">
              <input placeholder="image url" value={this.state.avatarUrlInput} onChange={this.onAvatarUrlInputChange} />
              <button onClick={this.setAvatarUrl}>done</button>
            </div> :
            <div className="avatar-edit">
              <img
                ref={'my-avatar'}
                alt="avatar"
                className="avatar"
                src={this.state.avatarUrl}
                onError={(e) => {this.refs['my-avatar'].src = DEFAULT_AVATAR_URL}}
              />
              <button onClick={this.toggleEditingAvatarUrl}>edit</button>
            </div>
          }
          <form onSubmit={this.onSubmit} ref="new-message-form">
            <textarea rows="4" value={this.state.input} onChange={this.onInputChange} onKeyDown={this.onEnterPress}/>
            <button type="submit">submit</button>
          </form>
        </div>
      </div>
    )
  }
}  

export default App;
