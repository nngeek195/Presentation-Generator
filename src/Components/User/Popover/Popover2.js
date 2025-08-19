import * as React from 'react';
import Popover from '@mui/material/Popover';
import './Popover2.css';

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
          sx: {
            p: 0,
            borderRadius: 2,
            maxWidth: 380,
            overflow: 'hidden'
          }
        }
      }}
    >
      <div className='popover2_content'>
        <div className='popover2_header'>
          <span className='popover2_content_topic'>
            📧 Notifications
          </span>
        </div>
        <hr className='popover2_divider' />

        <div className='popover2_body'>
          <div className='email_notification_container'>
            <div className='email_icon_large'>
              📬
            </div>

            <h3 className='email_title'>Check Your Email!</h3>

            <p className='email_description'>
              We've sent you important notifications via email. Please check your inbox for the latest updates and announcements.
            </p>

            <div className='email_action_buttons'>
              <button
                className='open_email_button'
                onClick={() => window.open('https://mail.google.com', '_blank')}
              >
                📧 Open Gmail
              </button>

              <button
                className='open_email_button outlook'
                onClick={() => window.open('https://outlook.live.com', '_blank')}
              >
                📨 Open Outlook
              </button>
            </div>

            <div className='email_tips'>
              <div className='tip_item'>
                <span className='tip_icon'>💡</span>
                <small><strong>Tip:</strong> Check your spam folder if you don't see our emails</small>
              </div>

              <div className='tip_item'>
                <span className='tip_icon'>🔔</span>
                <small><strong>Note:</strong> The notification count will reset when you click the bell icon</small>
              </div>

              <div className='tip_item'>
                <span className='tip_icon'>⚡</span>
                <small><strong>Quick Access:</strong> Bookmark your email for faster access</small>
              </div>
            </div>

            <div className='email_footer'>
              <small>
                Notifications are sent from <strong>your-app-name@gmail.com</strong>
              </small>
            </div>
          </div>
        </div>
      </div>
    </Popover>
  );
}
