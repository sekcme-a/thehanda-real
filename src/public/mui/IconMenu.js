import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const IconMenu = ({
  icon="threeDot",
  options=[
    {
      id: "편집",
      renderComponent: () => (
        <div style={{display:"flex", alignItems:"center"}}>
          <EditRoundedIcon style={{fontSize:"17px", marginRight:"5px"}}/>편집
        </div>
      )
    },
    {
      id: "복사",
      renderComponent: () => (
        <div style={{display:"flex", alignItems:"center"}}>
          <ContentCopyIcon style={{fontSize:"17px", marginRight:"5px"}}/>복사
        </div>
      )
    },
    {
      id: "삭제",
      renderComponent: () => (
        <div style={{display:"flex", alignItems:"center", color: "rgb(173, 27, 27)"}}>
          <DeleteRoundedIcon style={{fontSize:"17px", marginRight:"5px"}}/>삭제
        </div>
      )
    }
  ],
  handleMenuClick = (mode) => {alert(mode)},
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (option) => {
    if(typeof option === "string")
      handleMenuClick(option)
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {icon==="threeDot" && <MoreVertIcon />}
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        
      >
        {options.map((option) => (
          <MenuItem key={option.id} onClick={() => handleClose(option.id)} dense>
            {option.renderComponent()}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default IconMenu