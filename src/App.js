import React from "react";
import socketIOClient from "socket.io-client";

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
    socket.emit('data', this.state.input)
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
