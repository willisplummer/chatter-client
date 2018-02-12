import React from "react";
import socketIOClient from "socket.io-client";
import './App.css';

const endpoint = 'http://localhost:4001'

const socket = socketIOClient(endpoint)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {chat: [], input: ''}
    socket.on('update chat', chat => {
      console.log('received chat data', chat)
      this.setState({chat})
    })
    this.onInputChange = this.onInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onInputChange(event) {
    this.setState({input: event.target.value})
  }

  onSubmit() {
    const body = this.state.input
    const nickname = 'willis'
    const avatarUrl = 'https://hwhome.com/content/images/thumbs/0005759_water-jug-man_600.jpeg'
    socket.emit('data', { body, nickname, avatarUrl })
    this.setState({input: ''})
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="messages">
          {this.state.chat.map((message, i) =>
            <div className={i%2 === 0 ? "message white" : "message lightblue"} key={`chat-${message.id}`}>
              <img ref={message.id} alt="avatar" className="avatar" src={message.avatar} onError={(e) => {this.refs[message.id].src = 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'}} />
              <span className="message-body">{message.body}</span>
            </div>)
          }
        </div>
        <div className="message-input">
          <textarea rows="7" value={this.state.input} onChange={this.onInputChange}/>
          <button onClick={this.onSubmit}>submit</button>
        </div>
      </div>
    )
  }
}  

export default App;
