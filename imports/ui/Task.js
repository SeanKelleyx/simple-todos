import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import classnames from 'classnames';

// Task component - represents a single todo item
export default class Task extends Component {
	toggleChecked() {
		Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
	}
	deleteThisTask() {
        Meteor.call('tasks.remove', this.props.task._id);
	}
    togglePrivate() {
        Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
    }
	render() {
		const taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.private,
        });

		return (
			<li className={taskClassName}>
                { this.props.belongsToCurrentUser ? ( 
                    <button className="delete" onClick={this.deleteThisTask.bind(this)}>
                        &times; {this.userId}
                    </button>
                ) : ''}
				<input 
					type="checkbox"
					readOnly
					checked={!!this.props.task.checked}
					onClick={this.toggleChecked.bind(this)}
				/>
                { this.props.belongsToCurrentUser ? ( 
                    <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
                        {this.props.task.private ? 'Private' : 'Public'}
                    </button>
                 ) : ''}
				<span className="text"><strong>{this.props.task.username}</strong>: {this.props.task.text}</span>
			</li>
		);
	}
}
