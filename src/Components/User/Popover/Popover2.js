import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import './Popover2.css'


export default function MyPopover({ anchorE2, onClose }) {
  const open = Boolean(anchorE2);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorE2}
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
        <div className='popover2_content'>
          <span className='popover2_content_topic'>Latest Updates</span>
          <hr />
          <span></span>
        </div>
      </Typography>
    </Popover>
  );
}
