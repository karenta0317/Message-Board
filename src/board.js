import React, { Component } from 'react';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import MessageBlock from './block';

class MessageBoard extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      newName: '',
      newMessage: '',
      placeholder: 'Write the message...',
    };
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  componentDidMount() {
    fetch('/api/comments')
      .then(res => res.json())
      .then(d => this.setState({ data: d }))
      .catch(err => console.error(err));
//    console.log(this.state.data[0]);
  }

  handleChangeMessage(event) {
    this.setState({ newMessage: event.target.value });
  }
  handleChangeName(event) {
    this.setState({ newName: event.target.value.substr(0, 15) });
  }
  submitMessage() {
    let name = '';
    if (this.state.newName === '') {
      name = 'Anonymous';
    } else {
      name = this.state.newName;
    }
    if (this.state.newMessage === '') {
      alert('This post appeared to be empty. Please write something.');
    } else {
      fetch('/api/comments', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: name,
          text: this.state.newMessage,
        }),
      });
      this.setState({
        newMessage: '',
        newName: '',
      });
    }
  }
  render() {
    return (
      <div >
        <div className="title">
          <h1>Message <br /> Board </h1>
          <div className="newMessage">
            <p className="nm">New Message</p>
            <div className="inputBox">
              <input
                className="inputName"
                type="text" value={this.state.newName}
                onChange={this.handleChangeName}
                placeholder="Name"
              />
              <form className="textBox">
                <textarea
                  rows="8"
                  className="inputMessage"
                  type="text" value={this.state.newMessage}
                  onChange={this.handleChangeMessage}
                  placeholder={this.state.placeholder}
                />
                <span className="space" />
                <button className="submit" onClick={() => this.submitMessage()}>
                  <i className="material-icons">send</i>
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="wrapper">
          <div className="contentBox">
            <div className="MessageB">

              {
                this.state.data.slice(0).reverse().map(info =>
                  <MessageBlock
                    key={info.ID}
                    ID={info.ID}
                    userName={info.userName}
                    time={info.time}
                    text={info.text}
                    likeCount={info.likeCount}
                    reply={info.reply}
                  />,
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageBoard;
