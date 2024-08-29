import Bool "mo:base/Bool";
import Int "mo:base/Int";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Result "mo:base/Result";

actor {
  type Task = {
    id: Nat;
    description: Text;
    completed: Bool;
    dueDate: ?Int;
  };

  stable var taskId: Nat = 0;
  stable var tasks: [(Nat, Task)] = [];

  public func addTask(description: Text) : async Nat {
    taskId += 1;
    let newTask: Task = {
      id = taskId;
      description = description;
      completed = false;
      dueDate = null;
    };
    tasks := Array.append(tasks, [(taskId, newTask)]);
    taskId
  };

  public query func getTasks() : async [Task] {
    Array.map(tasks, func((_, task): (Nat, Task)): Task { task })
  };

  public func completeTask(id: Nat) : async Bool {
    let taskIndex = Array.indexOf<(Nat, Task)>((id, tasks[0].1), tasks, func(a, b) { a.0 == b.0 });
    switch (taskIndex) {
      case null { false };
      case (?index) {
        let (taskId, task) = tasks[index];
        let updatedTask = {
          id = task.id;
          description = task.description;
          completed = true;
          dueDate = task.dueDate;
        };
        tasks := Array.tabulate<(Nat, Task)>(tasks.size(), func (i) {
          if (i == index) { (taskId, updatedTask) } else { tasks[i] }
        });
        true
      };
    }
  };

  public func deleteTask(id: Nat) : async Bool {
    let newTasks = Array.filter<(Nat, Task)>(tasks, func((taskId, _)) { taskId != id });
    if (newTasks.size() < tasks.size()) {
      tasks := newTasks;
      true
    } else {
      false
    }
  };
}
