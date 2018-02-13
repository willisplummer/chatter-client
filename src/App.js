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
      avatarUrl: window.localStorage.getItem('chatterAvatarUrl') || '',
      avatarUrlInput: '',
      chat: [],
      editingAvatar: false,
      input: '',
      userCount: 1
    }
    socket.on('update chat', chat => {
      console.log('received chat data', chat)
      this.setState({chat})
      const messagesElement = document.getElementsByClassName("messages")[0]
      messagesElement.scrollTop = messagesElement.scrollHeight
    })

    this.onInputChange = this.onInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onAvatarUrlInputChange = this.onAvatarUrlInputChange.bind(this)
    this.toggleEditingAvatarUrl = this.toggleEditingAvatarUrl.bind(this)
    this.setAvatarUrl = this.setAvatarUrl.bind(this)
    this.onEnterPress = this.onEnterPress.bind(this)
  }

  setAvatarUrl() {
    window.localStorage.setItem('chatterAvatarUrl', this.state.avatarUrlInput)
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
          {this.state.chat.filter(m => m.room_id === room).map((message, i) =>
            <div className={i%2 === 0 ? "message white" : "message lightblue"} key={`chat-${message.id}`}>
              <img
                ref={message.id}
                alt="avatar"
                className="avatar"
                src={message.avatar}
                onError={(e) => {this.refs[message.id].src = DEFAULT_AVATAR_URL}}
              />
              <p className="message-body">{message.body}</p>
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
          <form onSubmit={this.onSubmit}>
            <textarea rows="4" value={this.state.input} onChange={this.onInputChange} onKeyDown={this.onEnterPress}/>
          </form>
          <div className="user-count">
            {this.state.userCount} {this.state.userCount === 1 ? 'person' : 'people'} in the room
          </div>
        </div>
      </div>
    )
  }
}  

export default App;
