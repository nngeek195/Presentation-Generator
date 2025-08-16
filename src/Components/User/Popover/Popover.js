import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { FaUserCircle } from 'react-icons/fa'
import './Popover.css'
import { Link } from 'react-router-dom'


export default function MyPopover({ anchorEl, onClose }) {
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
          <span><FaUserCircle className='default_icon_1' title='Change Profile Picture' /></span>
          <span>User's Workspace<div className='text_member'>Member</div></span>
          <span><Link to="/login"><button className='popover_logout'>Log Out</button></Link></span>
        </div>
      </Typography>
    </Popover>
  );
}
