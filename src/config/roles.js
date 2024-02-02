// define roles and permissions for access control
const ROLE = {
  USER: "user",
  MENTEE: "mentee",
  MENTOR: "mentor",
  ADMIN: "admin",
}

const allRoles = {
  user: ['manageNotes', 'getNotes', 'updateNotes'], 
  mentee: ['getUser', 'updateUser', 'manageNotes','getNotes', 'updateNotes'], 
  mentor: ['manageNotes', 'getNotes', 'updateNotes'], 
  admin: ['getUsers', 'manageUsers', 'manageNotes', 'getNotes'], 
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles)); // Usage: roleRights.get("admin")

export { ROLE, roles, roleRights };
