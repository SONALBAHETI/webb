import bcrypt from "bcrypt";

/**
 * @typedef {Object} UserMethods
 * @property {function(): Promise<boolean>} isPasswordMatch - Check if password matches the user's password
 * @property {function(): string|undefined} getFirstName - Get the user's first name
 * @property {function(): string|undefined} getLastName - Get the user's last name
 * @property {function(): string|undefined} getProfilePicture - Get the user's profile picture
 * @property {function(): string|undefined} getThreadId - Get the user's OpenAI thread ID
 * @property {function(): SheerIDIntegration|undefined} getSheerIdStatus - Get the user's SheerID integration
 * @property {function(): string[]} getDegrees - Get the user's degrees
 * @property {function(): string|undefined} getPrimaryRole - Get the user's primary role
 * @property {function(): string|undefined} getGender - Get the user's gender
 * @property {function(): string|undefined} getPronouns - Get the user's pronouns
 * @property {function(): string|undefined} getEthnicity - Get the user's ethnicity
 * @property {function(): string|undefined} getIdentity - Get the user's identity
 * @property {function(): string[]} getReligiousAffiliations - Get the user's religious affiliations
 * @property {function(): string[]} getCertifications - Get the user's certifications
 * @property {function(): string[]} getCommonlyTreatedDiagnoses - Get the user's commonly treated diagnoses
 * @property {function(): string[]} getBoardSpecialties - Get the user's board specialties
 * @property {function(): string[]} getExpertiseAreas - Get the user's expertise areas
 * @property {function(): string[]} getPracticeAreas - Get the user's practice areas
 * @property {function(): string[]} getPrimaryInterests - Get the user's primary interests
 * @property {function(): string[]} getPersonalInterests - Get the user's personal interests
 * @property {function(): number|undefined} getYearsInClinicalPractice - Get the user's years in clinical practice
 * @property {function(): string[]} getBadges - Get the user's badges
 * @property {function(): object} getStats - Get the user's stats
 * @property {function(): object} getAchievements - Get the user's achievements
 * @property {function(): string|undefined} getSendbirdId - Get the user's Sendbird ID
 * @property {function(): object} getSendbirdCredentials - Get the user's Sendbird credentials
 * @property {function(): StripeIntegration} getStripeData - Get the user's Stripe data
 * @property {function(): boolean} isResidencyTrained - Check if the user is residency trained
 * @property {function(): boolean} isFellowshipTrained - Check if the user is fellowship trained
 * @property {function(): boolean} isOnline - Check if the user is online
 * @property {function(): boolean} isActive - Check if the user is active
 */
export default {
  /**
   * Check if password matches the user's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async isPasswordMatch(password) {
    const user = this;
    return bcrypt.compare(password, user.password);
  },
  getFirstName() {
    return this.profile?.firstName;
  },
  getLastName() {
    return this.profile?.lastName;
  },
  getProfilePicture() {
    return this.profile?.picture;
  },
  getThreadId() {
    return this.integrations?.openai?.threadId;
  },
  /**
   * @returns {SheerIDIntegration} The SheerID integration
   */
  getSheerIdStatus() {
    return this.integrations?.sheerId;
  },
  getDegrees() {
    return this.profile?.education?.degrees || [];
  },
  getPrimaryRole() {
    return this.profile?.primaryRole;
  },
  getGender() {
    return this.profile?.gender;
  },
  getPronouns() {
    return this.profile?.pronouns;
  },
  getEthnicity() {
    return this.profile?.ethnicity;
  },
  getIdentity() {
    return this.profile?.identity;
  },
  getReligiousAffiliations() {
    return this.profile?.religiousAffiliations || [];
  },
  getCertifications() {
    return this.profile?.education?.certificates || [];
  },
  getCommonlyTreatedDiagnoses() {
    return this.profile?.expertise?.commonlyTreatedDiagnoses || [];
  },
  getBoardSpecialties() {
    return this.profile?.expertise?.boardSpecialties || [];
  },
  getExpertiseAreas() {
    return this.profile?.expertise?.expertiseAreas || [];
  },
  getPracticeAreas() {
    return this.profile?.expertise?.practiceAreas || [];
  },
  getPrimaryInterests() {
    return this.profile?.expertise?.primaryInterests || [];
  },
  getPersonalInterests() {
    return this.profile?.personalInterests || [];
  },
  getYearsInClinicalPractice() {
    return this.profile?.expertise?.yearsInClinicalPractice;
  },
  getBadges() {
    return this.achievements?.badges || [];
  },
  getStats() {
    return this.stats || {};
  },
  getAchievements() {
    return this.achievements || {};
  },
  getSendbirdId() {
    return this.integrations?.sendbird?.userId;
  },
  getSendbirdCredentials() {
    return this.integrations?.sendbird || {};
  },
  getStripeData() {
    return this.integrations?.stripe || {};
  },
  isResidencyTrained() {
    return this.profile?.education?.isResidencyTrained || false;
  },
  isFellowshipTrained() {
    return this.profile?.education?.isFellowshipTrained || false;
  },
  isOnline() {
    return this.availability?.online || false;
  },
  isActive() {
    return this.accountStatus?.isActive || false;
  },
};

/**
 * @typedef {import("../schemas/user/integrations.schema.js").SheerIDIntegration} SheerIDIntegration
 * @typedef {import("../schemas/user/integrations.schema.js").StripeIntegration} StripeIntegration
 */
