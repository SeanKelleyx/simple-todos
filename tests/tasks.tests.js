/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Tasks } from '../imports/api/tasks.js';
import { assert } from 'chai';
 
if (Meteor.isServer) {
    describe('Tasks', () => {
        describe('methods', () => {
            const userId = Random.id();
            const anotherId = Random.id();
            let taskId;

            beforeEach(() => {
                Tasks.remove({});
                taskId = Tasks.insert({
                    text: 'test task',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'seantest',
                });
            });
            it('user not logged in throws error when inserting task', () => {
                const insertTask = Meteor.server.method_handlers['tasks.insert'];
                //invocation takes place of 'this'
                const invocation = {};
                let throwsError = () => {
                    insertTask.apply(invocation, ['text']);  
                }
                assert.throws(throwsError, Error, "not-authorized");
            });
            it('can delete owned task', () => {
                const deleteTask = Meteor.server.method_handlers['tasks.remove'];
                //invocation takes place of 'this'
                const invocation = { userId };
                deleteTask.apply(invocation, [taskId]);
                assert.equal(Tasks.find().count(), 0);
            });
            it('deleting non-owned task throws error', () => {
                const deleteTask = Meteor.server.method_handlers['tasks.remove'];
                const invocation = { anotherId };
                let throwsError = () => {
                    deleteTask.apply(invocation, [taskId]);
                }
                assert.throws(throwsError, Error, "not-authorized");
            });
            it('can mark owned task private', () => {
                const setTaskPrivate = Meteor.server.method_handlers['tasks.setPrivate'];
                //invocation takes place of 'this'
                const invocation = { userId };
                setTaskPrivate.apply(invocation, [taskId, true]);
                let task = Tasks.findOne(taskId);
                assert.equal(task.private, true);
            });
            it('mark non-owned task private throws error', () => {
                const setTaskPrivate = Meteor.server.method_handlers['tasks.setPrivate'];
                //invocation takes place of 'this'
                const invocation = { anotherId };
                let throwsError = () => {
                    setTaskPrivate.apply(invocation, [taskId, true]);
                }
                assert.throws(throwsError, Error, "not-authorized");
            });
            it('can mark checked owned task', () => {
                const checkTask = Meteor.server.method_handlers['tasks.setChecked'];
                //invocation takes place of 'this'
                const invocation = { userId };
                checkTask.apply(invocation, [taskId, true]);
                let task = Tasks.findOne(taskId);
                assert.equal(task.checked, true);
            });
            it('can mark checked non-owned task', () => {
                const checkTask = Meteor.server.method_handlers['tasks.setChecked'];
                //invocation takes place of 'this'
                const invocation = { anotherId };
                checkTask.apply(invocation, [taskId, true]);
                let task = Tasks.findOne(taskId);
                assert.equal(task.checked, true);
            });
            it('mark private non-owned task checked throws error', () => {
                const setTaskPrivate = Meteor.server.method_handlers['tasks.setPrivate'];
                const checkTask = Meteor.server.method_handlers['tasks.setChecked'];
                //invocation takes place of 'this'
                const invocation = { userId };
                const anotherInvocation = { anotherId };
                setTaskPrivate.apply(invocation, [taskId, true]);
                let throwsError = () => {
                    checkTask.apply(anotherInvocation, [taskId, true]);
                }
                assert.throws(throwsError, Error, "not-authorized");
            });
        });
    });
}