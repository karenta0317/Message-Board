const express = require('express');
const bodyParser = require('body-parser');

const app = express();
let id = 0;
function CurrentTime() {
  const time = new Date();
  const day = (time.getDate() < 10) ? `0${time.getDate()}` : time.getDate();
  const month = (time.getMonth() < 10) ? `0${time.getMonth()}` : time.getMonth();
  const year = time.getFullYear();
  const hours = (time.getHours() < 10) ? `0${time.getHours()}` : time.getHours();
  const minutes = (time.getMinutes() < 10) ? `0${time.getMinutes()}` : time.getMinutes();
  const seconds = (time.getSeconds() < 10) ? `0${time.getSeconds()}` : time.getSeconds();
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
const messages = [
  {
    ID: 'example1',
    userName: 'Katherine',
    time: '2017/05/01 22:50:02',
    text: 'Double click the heart icon to like \nClick the comment icon to see the comment',
    likeCount: 1000,
    reply: [],
  },
  {
    ID: 'example2',
    userName: 'Zoe',
    time: '2017/05/01 22:52:02',
    text: 'Hello!',
    likeCount: 0,
    reply: [],
  },
];

app.use(bodyParser.json());
app.use(express.static('static'));
function sendHomepage(req, res) {
  // get comments first
  res.sendFile(__dirname + '/index.html');
}
function getComments(req, res) {
  res.json(messages);
}

function postComment(req, res) {
  console.log(`new post: userName:${req.body.userName} text:${req.body.text}`);
  messages.push({
    ID: `rootPost${id}`,
    userName: req.body.userName,
    time: CurrentTime(),
    text: req.body.text,
    likeCount: 0,
    reply: [],
  });
  id += 1;
  getComments(req, res);
}

function putRootLike(req, res) {
  for (let i = 0; i < messages.length; i += 1) {
    if (messages[i].ID === req.body.ID) {
      messages[i].likeCount += 1;
      break;
    }
  }
  getComments(req, res);
}
function putReplyLike(req, res) {
  let findRoot = false;
  let findChild = false;
  for (let i = 0; i < messages.length; i += 1) {
    if (messages[i].ID === req.body.rootID) {
      findRoot = true;
      for (let j = 0; j < messages[i].reply.length; j += 1) {
        if (messages[i].reply[j].ID === req.body.ID) {
          findChild = true;
          messages[i].reply[j].likeCount += 1;
          break;
        }
      }
      if (!findChild) {
        console.log(`root id ${req.body.rootID}did not find child id ${req.body.ID}`);
      }
    }
  }
  if (!findRoot) {
    console.log('did not find root');
  }

  getComments(req, res);
}
function postReply(req, res) {
  console.log(`new reply: rootID: ${req.body.rootID} ID: ${req.body.ID} userName:${req.body.text} text: ${req.body.userName}`);
  for (let i = 0; i < messages.length; i += 1) {
    if (messages[i].ID === req.body.rootID) {
      const newReply = {
        ID: req.body.ID,
        userName: req.body.userName,
        time: CurrentTime(),
        text: req.body.text,
        likeCount: 0,
      };
      messages[i].reply.push(newReply);
      break;
    }
  }
  getComments(req, res);
}

app.get('/', sendHomepage);
app.get('/api/comments', getComments);
app.post('/api/comments', postComment);
app.put('/api/rootLikes', putRootLike);
app.put('/api/replyLikes', putReplyLike);
app.post('/api/reply', postReply);

const port = process.env.PORT || 3000;
app.listen(port);

