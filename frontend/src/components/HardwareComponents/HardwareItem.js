import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import LayersIcon from '@material-ui/icons/Layers';
import MemoryIcon from '@material-ui/icons/Memory';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ToysIcon from '@material-ui/icons/Toys';
import Typography from '@material-ui/core/Typography';

class HardwareItem extends React.Component {
    render () {
        return (
            <ListItem>
                <ListItemAvatar>
                <Avatar>
                    {this.props.hardwareType == "CPU" && <MemoryIcon />}
                    {this.props.hardwareType == "GPU" && <LayersIcon />}
                </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={this.props.hardwareType + " - " + this.props.hardwareName}
                    secondary={<React.Fragment>
                        {this.props.original &&
                            <Typography
                                component="span"
                                variant="caption"
                                color="textPrimary"
                            >
                            {"Quantity: " + this.props.original }
                            </Typography>
                        }
                        {this.props.original && <br />}
                        { Number.isFinite(this.props.quantity) && this.props.quantity != this.props.original && <Typography
                          component="span"
                          variant="caption"
                          style={{color: '#f5b042', fontWeight: 'bold'}}
                        >
                          {"Alternative: " + this.props.quantity}
                        </Typography> }
                      </React.Fragment>}
                />
                <ListItemSecondaryAction>
                <IconButton onClick={() => { this.props.updateQuantityHandler(this.props.quantity + 1) }} edge="end" aria-label="add">
                    <AddIcon />
                </IconButton>
                <IconButton
                    onClick={() => {
                        this.props.updateQuantityHandler(this.props.quantity > 0 ? this.props.quantity - 1 : this.props.quantity)
                    }} edge="end" aria-label="remove">
                    <RemoveIcon />
                </IconButton>
                {/* <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                </IconButton> */}
                </ListItemSecondaryAction>
            </ListItem>
        )
    }
}

export default HardwareItem
