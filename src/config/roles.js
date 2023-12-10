// define roles and permissions for access control
const allRoles = {
  user: [],
  learner: ["getUser", "updateUser"],
  mentor: [],
  admin: ["getUsers", "manageUsers"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles)); // Usage: roleRights.get("admin")

export { roles, roleRights };
