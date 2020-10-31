import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import LayersIcon from '@material-ui/icons/Layers';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ToysIcon from '@material-ui/icons/Toys';

class HardwareItem extends React.Component {
    render () {
        return (
            <ListItem>
                <ListItemAvatar>
                <Avatar>
                    {this.props.hardwareType == "CPU" && <LayersIcon />}
                    {this.props.hardwareType == "GPU" && <ToysIcon />}
                </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={this.props.hardwareType + " - " + this.props.hardwareName}
                    secondary={"Quantity: " + this.props.quantity}
                />
                <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="add">
                    <AddIcon />
                </IconButton>
                <IconButton edge="end" aria-label="remove">
                    <RemoveIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }
}

export default HardwareItem
