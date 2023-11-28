// define roles and permissions for access control
const allRoles = {
  user: [],
  learner: [],
  mentor: [],
  admin: ["getUsers", "manageUsers"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

export { roles, roleRights };
