import { Permission } from "./permissions.js";

/**
 * User roles
 * @readonly
 * @enum {string}
 */
const ROLE = {
  USER: "user",
  MENTEE: "mentee",
  INTERIM_MENTOR: "interimMentor",
  MENTOR: "mentor",
  ADMIN: "admin",
};

/**
 * Common user permissions
 * @type {string[]}
 * @readonly
 */
const CommonUserPermissions = [
  Permission.DeactivateAccount,
  Permission.DeleteAccount,
  Permission.ReadNotificationSettings,
  Permission.UpdateNotificationSettings,
  Permission.ReadNotifications,
  Permission.ReadSuggestions,
  Permission.ReadUserProfile,
  Permission.UpdateUserProfile,
];

/**
 * Bare minimum mentor permissions,
 * assign this role to newly created mentors
 * @type {string[]}
 * @readonly
 */
const interimMentorPermissions = [
  Permission.SyncGoogleCalendar,
  Permission.ReadSendbirdCredentials,
  Permission.LicenseVerification,
  Permission.SubmitSheerIDDocuments,
  Permission.SubmitIdentityInformation,
  Permission.SubmitEducationInformation,
  Permission.SubmitExpertiseInformation,
  Permission.ReadAvailability,
  Permission.UpdateAvailability,
  Permission.ReadAchievements,
];

/**
 * Mentor permissions
 * @type {string[]}
 * @readonly
 */
const MentorPermissions = [
  Permission.CreateQuickReplies,
  Permission.ReadQuickReplies,
  Permission.UpdateQuickReplies,
  Permission.DeleteQuickReplies,
  Permission.SyncGoogleCalendar,
  Permission.CreateAppointments,
  Permission.ReadAppointments,
  Permission.UpdateAppointments,
  Permission.DeleteAppointments,
  Permission.ReadSendbirdCredentials,
  Permission.CreateChatRequests,
  Permission.ReadChatRequests,
  Permission.UpdateChatRequests,
  Permission.DeleteChatRequests,
  Permission.LicenseVerification,
  Permission.SubmitSheerIDDocuments,
  Permission.CreateNotes,
  Permission.ReadNotes,
  Permission.UpdateNotes,
  Permission.DeleteNotes,
  Permission.SubmitIdentityInformation,
  Permission.SubmitEducationInformation,
  Permission.SubmitExpertiseInformation,
];

/**
 * Mentee permissions
 * @type {string[]}
 * @readonly
 */
const MenteePermissions = [
  Permission.CreateAppointments,
  Permission.ReadAppointments,
  Permission.UpdateAppointments,
  Permission.DeleteAppointments,
  Permission.ReadSendbirdCredentials,
  Permission.CreateChatRequests,
  Permission.ReadChatRequests,
  Permission.UpdateChatRequests,
  Permission.DeleteChatRequests,
  Permission.ReadChatbotMessages,
  Permission.CreateChatbotMessages,
  Permission.ReadUserMatches,
  Permission.SubmitSheerIDDocuments,
  Permission.StudentVerification,
  Permission.CreateNotes,
  Permission.ReadNotes,
  Permission.UpdateNotes,
  Permission.DeleteNotes,
  Permission.SubmitIdentityInformation,
  Permission.SubmitEducationInformation,
];

/**
 * Admin permissions
 * @type {string[]}
 * @readonly
 */
const AdminPermissions = [Permission.ReadUserProfile];

/**
 * All roles and their permissions
 * @readonly
 */
const allRoles = {
  user: CommonUserPermissions,
  mentee: [...MenteePermissions, ...CommonUserPermissions],
  interimMentor: [...interimMentorPermissions, ...CommonUserPermissions],
  mentor: [...MentorPermissions, ...CommonUserPermissions],
  admin: AdminPermissions,
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles)); // Usage: roleRights.get("admin")

export { ROLE, roles, roleRights };
