import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import {StreamChat} from 'stream-chat';

import signinImage from '../assets/assets/signup.jpg';

// // Initialize Stream Chat client
// const chatClient = StreamChat.getInstance("sgkphqy29c4b");
// const channelType = 'team'
// const chatClient = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY);

const cookies = new Cookies();

const initialState = {
  fullName: '',
  username: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  avatarURL: ''
}

const Auth = () => {
  const [form, setForm] = useState(initialState)
  const [isSignup, setIsSignup] = useState(true);

  // Initialize Stream Chat client
  // const apiKey = process.env.REACT_APP_STREAM_API_KEY;
  const apiKey = "sgkphqy29c4b";
  const chatClient = StreamChat.getInstance(apiKey);
  const channelType = 'team';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value})
  }

  const handleAddUserToChannel = async (userId) => {
    try {
      // Connect user to Stream Chat
      await chatClient.connectUser({ id: userId, fullName: form.fullName }, cookies.get('token'));

      // Get the channel
      const channel = chatClient.channel(channelType, 'new-users'); // Replace 'YOUR_CHANNEL_ID' with your channel ID
      // Add the user to the channel
      await channel.addMembers([userId]);
    } catch (error) {
      console.error('Error adding user to channel:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      username, 
      password, 
      phoneNumber, 
      avatarURL
    } = form; 

    const URL = 'http://localhost:9100/auth';

    try {
      const {data: {token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`,{
        username, password, fullName: form.fullName, phoneNumber, avatarURL
      });
  
      cookies.set('token', token);
      cookies.set('userId', userId);
      cookies.set('username', username);
      cookies.set('fullName', fullName);
  
      if(isSignup){
        cookies.set('phoneNumber', phoneNumber);
        cookies.set('avatarURL', avatarURL);
        cookies.set('hashedPassword', hashedPassword);

        await handleAddUserToChannel(userId);
      }
  
      window.location.reload();
    } catch (error) {
      console.log('AUthentication error', error);
    }
  }

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  }

  return (
    <div className='auth__form-container'>
      <div className="auth__form-container_fields">
        <div className='auth__form-container_fields-content'>
          <p>{isSignup ? 'Sign up' : 'Sign In'}</p>

          <form onSubmit={handleSubmit}>
            {isSignup && (
                <div className="auth__form-container_fields-content_input">
                  <label htmlFor="fullName">Full Name</label>
                  <input 
                    type="text" 
                    name='fullName'
                    placeholder='Full Name'
                    onChange={handleChange}
                    required
                    
                  />
                </div>
            )}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="username">UserName</label>
              <input 
                type="text" 
                name='username'
                placeholder='Username'
                onChange={handleChange}
                required
                
              />
            </div>
            {isSignup && (
                <div className="auth__form-container_fields-content_input">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input 
                    type="text" 
                    name='phoneNumber'
                    placeholder='Phone Number'
                    onChange={handleChange}
                    required
                   
                  />
                </div>
            )}
            {isSignup && (
                <div className="auth__form-container_fields-content_input">
                  <label htmlFor="avatarURL">Avatar URL</label>
                  <input 
                    type="text" 
                    name='avatarURL'
                    placeholder='Avatar URL'
                    onChange={handleChange}
                    required
                    
                  />
                </div>
            )}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                name='password'
                placeholder='Password'
                onChange={handleChange}
                required
                
              />
            </div>
            {isSignup && (
                <div className="auth__form-container_fields-content_input">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  type="password" 
                  name='confirmPassword'
                  placeholder='Confirm Password'
                  onChange={handleChange}
                  required
                  
                />
              </div>
            )}
            
            <div className="auth__form-container_fields-content_button">
              <button>{isSignup ? 'Sign Up' : 'Sign In'}</button>
            </div>
          </form>
          {/* Switch mode */}
          <div className="auth__form-container_fields-account">
              <p>
                {isSignup 
                  ? `Already have an account? ` 
                  : 'Don\'t have an account yet? '
                }
                <span onClick={switchMode} style={{color: 'var(--primary-color)'}}>
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </span>
              </p>
          </div>
        </div>
      </div>
      <div className='auth__form-container_image'>
            <img src={signinImage} alt="sign in" />
      </div>
    </div>
  )
}

export default Auth
