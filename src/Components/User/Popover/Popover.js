import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { FaUserCircle } from 'react-icons/fa'
import './Popover.css'

export default function MyPopover({ anchorEl, onClose, onLogout, username, userProfilePicture }) {
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined; 

  const handleLogout = () => {
    onClose(); 
    if (onLogout) {
      onLogout(); 
    }
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      slotProps={{
        paper: {
          sx: { p: 2, borderRadius: 2 }
        }
      }}
    >
      <Typography>
        <div className='popover_content'>
          <span>
            {userProfilePicture ? (
              <img
                src={userProfilePicture}
                alt='Profile'
                className='popover_profile_picture'
                title='Change Profile Picture'
              />
            ) : (
              <FaUserCircle className='default_icon_1' title='Change Profile Picture' />
            )}
          </span>

          <span>
            {username ? `${username}'s Workspace` : "User's Workspace"}
            <div className='text_member'>Member</div>
          </span>

          <span>
            <button className='popover_logout' onClick={handleLogout}>
              Log Out
            </button>
          </span>
        </div>
      </Typography>
    </Popover>
  );
}
