export const idlFactory = ({ IDL }) => {
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'completed' : IDL.Bool,
    'dueDate' : IDL.Opt(IDL.Int),
    'description' : IDL.Text,
  });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'completeTask' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'deleteTask' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
