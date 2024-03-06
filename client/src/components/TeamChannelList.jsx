import React from 'react';

import { AddChannel } from '../assets/assets';

const TeamChannelList = ({ 
  children, 
  error = false, 
  loading, 
  type, 
  isCreating, 
  setIsCreating, 
  setCreateType, 
  setIsEditing,
  setToggleContainer
}) => {

  if(error){
    return type === 'team' ? (
      <div className="team-channel-list">
        <p className='team-channel-list__message' style={{color: 'black'}}>
          Connection error, please wait a moment and try again
        </p>
      </div>
    ) : null
  }

  if(loading){
    return (
      <div className="team-channel-list">
        <p className='team-channel-list__message loading' style={{color: 'black'}}>
          {type === 'team' ? 'Channels' : 'Messages'} loading...
        </p>
      </div>
    )
  }

  return (
    <div className='team-channel-list'>
      <div className="team-channel-list__header">
        <p className="team-channel-list__header__title" style={{color: 'black'}}>
          {type === 'team' ? 'Channels' : 'Direct Messages'}
        </p>
        {/* Button - add channel */}
        <AddChannel
          isCreating={isCreating} 
          setIsCreating={setIsCreating} 
          setCreateType={setCreateType} 
          setIsEditing={setIsEditing}
          setToggleContainer={setToggleContainer}
          type={type === 'team' ? 'team' : 'messaging'}
        />
      </div>
      {children}
    </div>
  )
}

export default TeamChannelList