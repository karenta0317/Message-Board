import React, { Component } from 'react';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import ReplyBlock from './reply';

class MessageBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ID: this.props.ID,
      userName: this.props.userName,
      time: this.props.time,
      text: this.props.text,
      likeCount: this.props.likeCount,
      reply: this.props.reply,
      haveLike: false,
      showReply: false,
      replyName: '',
      replyMessage: '',
      placeholder: 'Write your reply here...',
    };
    this.likePost = this.likePost.bind(this);
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.replyMessage = this.replyMessage.bind(this);
    this.likeIcon = this.likeIcon.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.showReply = this.showReply.bind(this);
  }
  likePost() {
    if (this.state.haveLike === false) {
      fetch('/api/rootLikes', {
        method: 'put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID: this.state.ID,
          addLike: 1,
        }),
      }).then(() => this.setState({ haveLike: true, likeCount: this.state.likeCount + 1 }))
      .catch(err => console.error(err));
    }
  }
  handleChangeMessage(event) {
    this.setState({ replyMessage: event.target.value });
  }
  handleChangeName(event) {
    this.setState({ replyName: event.target.value.substr(0, 15) });
  }
  handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.replyMessage();
    }
  }
  replyMessage() {
    let name = '';
    if (this.state.replyName === '') {
      name = 'Anonymous';
    } else {
      name = this.state.replyName;
    }
    if (this.state.replyMessage === '') {
      this.setState({
        placeholder: 'This  post appeared to be empty. Please write something.',
      });
    } else {
      const gTime = new Date().getTime();
      fetch('/api/reply', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rootID: this.state.ID,
          ID: `${this.state.ID}-${gTime}`,
          userName: name,
          text: this.state.replyMessage,
        }),
      });
      const newR = this.state.reply;
      const updateReplay = {
        ID: `${this.state.ID}-${gTime}`,
        userName: name,
        time: 'update a second ago...',
        text: this.state.replyMessage,
        likeCount: 0,
      };
      newR.push(updateReplay);
      this.setState({
        replyMessage: '',
        replyName: '',
        reply: newR,
        placeholder: 'Write your reply here...',
      });
    }
  }
  likeIcon() {
    if (this.state.haveLike === false) {
      return <i className="material-icons favoriteBorder">favorite_border</i>;
    }
    return <i className="material-icons favorite">favorite</i>;
  }
  showReply() {
    const newDisplay = !this.state.showReply;
    this.setState({ showReply: newDisplay });
  }
  render() {
    return (
      <div className="messageWrapper">
        <div className="message" id={this.state.ID}>
          <div className="messageUser">
            <div className="circle">{this.state.userName[0].toUpperCase()}</div>
            <br />
            <div className="fullName">{this.state.userName}</div>
            <p className="time">{this.state.time}</p>
          </div>
          <div className="messageContent">
            <div className="text">{this.state.text}</div>
            <div className="functionIcon">
              <button className="buttonLike" onDoubleClick={() => this.likePost()}>
                {this.likeIcon()}
              </button>
              <span clsasName="likeCount">{this.state.likeCount} likes</span>
              <button className="showHide buttonLike" onClick={() => this.showReply()}>
                <i className="material-icons">mode_comment</i>
              </button>
            </div>
            <div className={`messageReply ${(this.state.showReply ? 'show' : 'notShow')}`}>
              {
                  this.state.reply.map(r =>
                    <ReplyBlock
                      key={r.ID}
                      rootID={this.state.ID}
                      ID={r.ID}
                      userName={r.userName}
                      time={r.time}
                      text={r.text}
                      likeCount={r.likeCount}
                    />,
                  )
              }
              <div className="replyInput">
                <br />
                <textarea
                  rows="1"
                  className="replyFormat"
                  type="text" value={this.state.replyName}
                  onChange={this.handleChangeName}
                  placeholder="Name"
                />
                <textarea
                  type="text"
                  value={this.state.replyMessage}
                  rows="3"
                  className="replyFormat"
                  onChange={this.handleChangeMessage}
                  placeholder={this.state.placeholder}
                  onKeyPress={this.handleKeyPress}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MessageBlock.propTypes = {
  ID: React.PropTypes.number.isRequired,
  userName: React.PropTypes.string.isRequired,
  time: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
  likeCount: React.PropTypes.number.isRequired,
  reply: React.PropTypes.shape({
    ID: React.PropTypes.number.isRequired,
    userName: React.PropTypes.string.isRequired,
    time: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    likeCount: React.PropTypes.number.isRequired,
  }).isRequired,
};
export default MessageBlock;
