import React, { Component } from 'react';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';

class ReplyBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rootID: this.props.rootID,
      ID: this.props.ID,
      userName: this.props.userName,
      time: this.props.time,
      text: this.props.text,
      likeCount: this.props.likeCount,
      haveLike: false,

    };
    this.likePost = this.likePost.bind(this);
    this.likeIcon = this.likeIcon.bind(this);
  }
  likePost() {
    if (this.state.haveLike === false) {
      fetch('/api/replyLikes', {
        method: 'put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rootID: this.state.rootID,
          ID: this.state.ID,
          addLike: 1,
        }),
      }).then(() => this.setState({ haveLike: true, likeCount: this.state.likeCount + 1 }))
      .catch(err => console.error(err));
    }
  }
  likeIcon() {
    if (this.state.haveLike === false) {
      return <i className="material-icons favoriteBorderReply">favorite_border</i>;
    }
    return <i className="material-icons favoriteReply">favorite</i>;
  }
  render() {
    return (
      <div className="replyBlock" id={this.state.ID}>
        <p className="replyText">{this.state.userName} replied... </p>
        <p className="replyText">{this.state.text}</p>
        <p className="replyTime replyText">
          <button className="buttonLike" onDoubleClick={() => this.likePost()}>
            {this.likeIcon()}
          </button>
          {this.state.likeCount} likes {this.state.time}
        </p>
      </div>
    );
  }
}


ReplyBlock.propTypes = {
  rootID: React.PropTypes.number.isRequired,
  ID: React.PropTypes.number.isRequired,
  userName: React.PropTypes.string.isRequired,
  time: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
  likeCount: React.PropTypes.number.isRequired,
};
export default ReplyBlock;
