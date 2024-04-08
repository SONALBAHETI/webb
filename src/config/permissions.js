/**
 * Permissions Enum
 * @readonly
 * @enum {string}
 */
export const Permission = {
  // Quick Replies
  CreateQuickReplies: "createQuickReplies",
  ReadQuickReplies: "readQuickReplies",
  UpdateQuickReplies: "updateQuickReplies",
  DeleteQuickReplies: "deleteQuickReplies",

  // Account Settings
  DeactivateAccount: "deactivateAccount",
  DeleteAccount: "deleteAccount",
  SyncGoogleCalendar: "syncGoogleCalendar",

  // Notifications
  ReadNotificationSettings: "readNotificationSettings",
  UpdateNotificationSettings: "updateNotificationSettings",
  ReadNotifications: "readNotifications",
  
  // Appointment
  CreateAppointments: "createAppointments",
  ReadAppointments: "readAppointments",
  UpdateAppointments: "updateAppointments",
  DeleteAppointments: "deleteAppointments",

  // Chat
  ReadSendbirdCredentials: "readSendbirdCredentials",
  ReadChatRequests: "readChatRequests",
  CreateChatRequests: "createChatRequests",
  UpdateChatRequests: "updateChatRequests",
  DeleteChatRequests: "deleteChatRequests",

  // Chatbot
  ReadChatbotMessages: "readChatbotMessages",
  CreateChatbotMessages: "createChatbotMessages",

  // Matchmaking
  ReadUserMatches: "readUserMatches",

  // Identity Verification
  LicenseVerification: "licenseVerification",
  SubmitSheerIDDocuments: "submitSheerIDDocuments",
  StudentVerification: "studentVerification",

  // Notes
  CreateNotes: "createNotes",
  ReadNotes: "readNotes",
  UpdateNotes: "updateNotes",
  DeleteNotes: "deleteNotes",

  // Combo box suggestions
  ReadSuggestions: "readSuggestions",

  // User Profile
  ReadUserProfile: "readUserProfile",
  UpdateUserProfile: "updateUserProfile",
  SubmitIdentityInformation: "submitIdentityInformation",
  SubmitEducationInformation: "submitEducationInformation",
  SubmitExpertiseInformation: "submitExpertiseInformation",
  ReadAchievements: "readAchievements",
  ReadVisibility: "readVisibility",
  UpdateVisibility: "updateVisibility",
  ReadAvailability: "readAvailability",
  UpdateAvailability: "updateAvailability",

  // Payments (Stripe)
  ManagePayouts: "managePayouts",
  ManageSubscriptions: "manageSubscriptions",
  ManageCredits: "manageCredits",

  // Feedback
  CreateUserReports: "createUserReports",
  ReadUserReports: "readUserReports",
  UpdateUserReports: "updateUserReports",
  DeleteUserReports: "deleteUserReports",
}

/**
 * Permission Sets
 * @readonly
 * @enum {string[]}
 */
export const PermissionSets = {
  ManageAppointments: [
    Permission.CreateAppointments,
    Permission.ReadAppointments,
    Permission.UpdateAppointments,
    Permission.DeleteAppointments,
  ],
  Chat: [
    Permission.ReadSendbirdCredentials,
    Permission.ReadChatRequests,
    Permission.CreateChatRequests,
    Permission.UpdateChatRequests,
    Permission.DeleteChatRequests,
  ],
  Chatbot: [
    Permission.ReadChatbotMessages,
    Permission.CreateChatbotMessages,
  ],
  Matchmaking: [
    Permission.ReadUserMatches,
  ],
  Notes: [
    Permission.CreateNotes,
    Permission.ReadNotes,
    Permission.UpdateNotes,
    Permission.DeleteNotes,
  ]
}

export const PermissionValues = Object.values(Permission);