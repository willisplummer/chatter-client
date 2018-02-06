import React from "react";
import socketIOClient from "socket.io-client";

const endpoint = 'http://localhost:4001'

const socket = socketIOClient(endpoint)
const emitClickEvent = (data, cb) => socket.emit('data', data, cb)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {chat: ['testing'], input: ''}
    socket.on('init', chat => {
      console.log('received init', chat)
      this.setState({chat})
    })
    this.onInputChange = this.onInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onInputChange(event) {
    this.setState({input: event.target.value})
  }

  onSubmit() {
    emitClickEvent(this.state.input, chat => {this.setState({chat})})
    this.setState({input: ''})
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <input value={this.state.input} onChange={this.onInputChange}/>
        <button onClick={this.onSubmit}>test</button>
        {this.state.chat.map((c, i) =>
          <div key={`chat-${i}`}>{c}</div>)
        }
      </div>
    )
  }
}  

export default App;
