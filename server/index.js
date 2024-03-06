const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoute.js');

const app = express();
const PORT = process.env.PORT || 5000;
// dotenv.config();
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

// app.use(cors());
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});


app.get('/', (req, res) => {
  res.send('Hello, World!')
});

app.post('/', (req, res) => {
  const {message, user: sender, type, members} = req.body;

  if(type === 'message.new'){
    members
      .filter((member) => member.user_id !== sender.id)
      .forEach(({user}) => {
        if(!user.online){
          twilioClient.messages.create({
            body: `You have a new message from ${message.user.fullName} - ${message.text}`,
            // messagingServiceSid: 
            to: user.phoneNumber
          })
            .then(() => console.log('Message sent!'))
            .catch((err) => console.log(err));
        }
      })
      return res.status(200).send('Message Sent!');
  }

  return res.status(200).send('Not a new message request');
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/auth', authRoutes);
