/** Simple DoList App developed with Meteor.js v1.1.0.2
 *  Twitter Bootstrap v1.0.1 Used
 * */

// Initialize a collection 'tasks' which need to hold the list of tasks
Tasks = new Meteor.Collection("tasks");

// This part will be executed when the app running on 'client' environment
if (Meteor.isClient) {

    /** helpers are behaviors like variables, Its returning some values in run time*/
    // Definition of helpers under 'taskdescription' template
    Template.tasksdescription.helpers({
        tasksdone: function () {
            return Tasks.find({done: true}).fetch().length;
        },
        totaltasks: function () {
            return Tasks.find().count();
        },
        remainingtasks: function () {
            return Tasks.find().count() - Tasks.find({done: true}).fetch().length
        }
    });
    Template.todo.helpers({
        tasks: function () {
            return Tasks.find();
        },
        done: function () {
            if (this.done) {
                return "workdone";
            }
        }
    });

    /** Events are actions done by user in UI
     * Those are executed when the specified event is raised by the user
     * */
    Template.action.events({
        'click #addtask': function () {
            var newTask = $('#newtask');
            if (newTask.val().length == "") {
                alert('Please enter a task');
                return false;
            }
            Tasks.insert({task: newTask.val(), done: false});
            newTask.val('');
        },
        'click #clearselected': function () {
            //Tasks.remove(this._id);
            Meteor.call('removeDone');
        },
        'click #clearall': function () {
            //Tasks.remove(this._id);
            Meteor.call('removeAll');
        }
    });
    Template.todo.events({
        'click #donetask': function () {
            var fetchTaskFromDB = Tasks.find({_id: this._id}).fetch();
            fetchTaskFromDB[0].done ? Tasks.update({_id: this._id}, {$set: {done: false}}) : Tasks.update({_id: this._id}, {$set: {done: true}});
        }
    });
}

// This part will be executed when the app running on 'server' environment
if (Meteor.isServer) {

    /** Executed before of all helpers & events are called*/
    Meteor.startup(function () {
        var preTasks = [
            {task: 'Learn Meteor', done: false},
            {task: 'Do samples', done: false},
            {task: 'Getting clear', done: false}
        ];
        if (Tasks.find().count() == 0) {
            for (var i = 0; i < preTasks.length; i++) {
                Tasks.insert(preTasks[i]);
            }
        }

        /** Common methods(or functions) definition**/
        return Meteor.methods({
            removeDone: function () {
                return Tasks.remove({done: {$eq: true}});
            },
            removeAll: function () {
                return Tasks.remove({});
            }
        });
    });
}
