import User from "../models/user.model.js";
import { WEIGHTS } from "./weights.js";
import {
  createMatchRegex,
  getArrayMatchScore,
  getStringMatchScore,
} from "./utils.js";
import { createUserMatch as insertUserMatch } from "../services/userMatch.service.js";

/**
 * Scores mentors based on the given inquiry, taking into account various matching criteria.
 *
 * @param {Array<import("mongoose").Document>} mentors - The array of mentors to be scored
 * @param {Object} inquiry - The inquiry object containing the criteria for scoring
 * @return {Array<{ score: number, mentor: import("mongoose").Document }>} An array of scored mentors
 */
export const scoreMentorsByInquiry = (mentors, inquiry) => {
  const scoredMentors = mentors.map((mentor) => {
    let score = 0;

    // calculate score based on degrees
    score += getArrayMatchScore(
      inquiry.degrees,
      mentor.getDegrees(),
      WEIGHTS.DEGREES
    );

    // calculate score by matching areas of interest with mentor's areas of practice
    score += getArrayMatchScore(
      inquiry.areasOfInterest,
      mentor.getPracticeAreas(),
      WEIGHTS.PRIMARY_AREAS_OF_PRACTICE
    );

    // calculate score by matching areas of expertise
    score += getArrayMatchScore(
      inquiry.areasOfExpertise,
      mentor.getExpertiseAreas(),
      WEIGHTS.AREAS_OF_EXPERTISE
    );

    // calculate score by matching areas of interest with areas of expertise
    score += getArrayMatchScore(
      inquiry.areasOfInterest,
      mentor.getExpertiseAreas(),
      WEIGHTS.AREAS_OF_EXPERTISE
    );

    // calculate score by matching board specialities
    score += getArrayMatchScore(
      inquiry.boardSpecialties,
      mentor.getBoardSpecialties(),
      WEIGHTS.BOARD_SPECIALTIES
    );

    // calculate score by matching certificates
    score += getArrayMatchScore(
      inquiry.certificates,
      mentor.getCertifications(),
      WEIGHTS.CERTIFICATES
    );

    // calculate score by matching commonly treated diagnoses
    score += getArrayMatchScore(
      inquiry.commonlyTreatedDiagnoses,
      mentor.getCommonlyTreatedDiagnoses(),
      WEIGHTS.COMMONLY_TREATED_DIAGNOSES
    );

    // calculate score by matching commonly treated diagnoses
    score += getArrayMatchScore(
      inquiry.personalInterests,
      mentor.getPersonalInterests(),
      WEIGHTS.PERSONAL_INTERESTS
    );

    // calculate score by matching commonly treated diagnoses
    score += getArrayMatchScore(
      inquiry.personalInterests,
      mentor.getPersonalInterests(),
      WEIGHTS.PERSONAL_INTERESTS
    );

    // calculate score based on ethnicity match
    score += getStringMatchScore(
      inquiry.ethnicity,
      mentor.getEthnicity(),
      WEIGHTS.ETHNICITY
    );

    // calculate score based on gender match
    score += getStringMatchScore(
      inquiry.gender,
      mentor.getGender(),
      WEIGHTS.GENDER
    );

    // calculate score based on religious affiliations
    score += getArrayMatchScore(
      inquiry.religiousAffiliations,
      mentor.getReligiousAffiliations(),
      WEIGHTS.RELIGIOUS_AFFILIATIONS
    );

    // calculate score based on years in clinical practice
    if (
      inquiry.yearsInClinicalPractice &&
      mentor.getYearsInClinicalPractice() >= inquiry.yearsInClinicalPractice
    ) {
      score += WEIGHTS.YEARS_IN_CLINICAL_PRACTICE;
    }

    // calculate score based on residency or fellowship trained
    if (
      inquiry.residencyOrFellowshipTrained &&
      (mentor.isResidencyTrained() || mentor.isFellowshipTrained())
    ) {
      score += WEIGHTS.RESIDENCY_OR_FELLOWSHIP_TRAINED;
    }

    // calculate score based on primary role
    score += getStringMatchScore(
      inquiry.primaryRole,
      mentor.getPrimaryRole(),
      WEIGHTS.PRIMARY_ROLE
    );

    // calculate score based on pronouns
    score += getStringMatchScore(
      inquiry.pronouns,
      mentor.getPronouns(),
      WEIGHTS.PRONOUNS
    );

    // calculate score based on identity
    score += getStringMatchScore(
      inquiry.identity,
      mentor.getIdentity(),
      WEIGHTS.IDENTITY
    )

    return { mentor, score };
  });

  return scoredMentors;
};

/**
 * Create an array of regular expressions for searching based on the given inquiry.
 *
 * @param {Object} inquiry - The inquiry object containing various search criteria.
 * @return {Array<RegExp>} An array of regular expressions for searching.
 */
const createRegexSearchArray = (inquiry) => {
  const regexSearchArray = [];

  // add non-array string fields - gender, ethnicity, primary role, identiy, and pronouns 
  // to search array
  [
    inquiry.gender,
    inquiry.ethnicity,
    inquiry.primaryRole,
    inquiry.pronouns,
    inquiry.identity,
  ].forEach((field) => {
    if (field) {
      regexSearchArray.push(createMatchRegex(field));
    }
  });

  // add string array fields - degrees, certificates, personal interests, board specialities, areas of interest, 
  // areas of expertise, commonly treated diagnoses, tags, and religious affiliations 
  // to search array
  [
    inquiry.degrees,
    inquiry.certificates,
    inquiry.personalInterests,
    inquiry.boardSpecialties,
    inquiry.areasOfInterest,
    inquiry.areasOfExpertise,
    inquiry.commonlyTreatedDiagnoses,
    inquiry.religiousAffiliations,
    inquiry.tags,
  ].forEach((field) => {
    field?.forEach((item) => {
      regexSearchArray.push(createMatchRegex(item));
    });
  });

  return regexSearchArray;
};

/**
 * Aggregates mentors based on the provided search array using the aggregation pipeline.
 * Scores the mentors based on the number of tags matched.
 * Sorts the mentors by score in descending order.
 *
 * @param {Array<RegExp>} regexSearchArray - Array of regular expressions for searching mentors.
 * @return An array of aggregated mentor search results.
 */
const aggregateSearchMentors = async (regexSearchArray) => {
  // aggregation pipeline
  const mentorsAggregationResult = await User.aggregate([
    // creates a separate document for each array item (with same _id)
    { $unwind: "$profile.tags" },
    // filters out documents where tags are not in the search array
    { $match: { "profile.tags": { $in: regexSearchArray } } },
    // groups documents by _id and counts the number of tags matched
    {
      $group: {
        _id: "$_id",
        count: { $sum: 1 },
        matchedTags: { $push: "$profile.tags" },
        user: { $first: "$$ROOT" }, // Store the entire user document in a field called 'user'
      },
    },
    // calculates the score based on the number of tags matched
    {
      $project: {
        _id: 1,
        matchedTags: 1,
        count: 1,
        user: 1,
        score: { $divide: ["$count", regexSearchArray.length] },
      },
    },
    // sorts documents by score in descending order
    { $sort: { score: -1 } },
    // limits the number of documents returned to 50
    { $limit: 50 },
  ]);
  return mentorsAggregationResult;
};

/**
 * Match mentors based on the given inquiry, and return the top 8 scored mentors.
 * TODO: Also calculate score based on mentee's details matched with mentor's details
 * @param {Object} inquiry - The inquiry object used to search for mentors
 * @return The top 8 scored mentors based on the inquiry
 */
const matchMentors = async (inquiry) => {
  // check if inquiry is empty
  if (!inquiry || Object.keys(inquiry).length === 0) {
    return [];
  }

  // create an array of regular expressions for searching mentors
  const regexSearchArray = createRegexSearchArray(inquiry);

  // aggregation result
  const mentorsAggregationResult = await aggregateSearchMentors(
    regexSearchArray
  );

  // map mentor's _id to their query score
  const mentorQueryScoreMap = mentorsAggregationResult.reduce((map, item) => {
    map.set(item._id.toString(), item.score);
    return map;
  }, new Map());

  // pick documents from aggregation result
  const mentorsDocuments = mentorsAggregationResult.map(
    (mentor) => new User(mentor.user)
  );

  // score mentors based on individual weights of the fields and inquiry
  const scoredMentors = scoreMentorsByInquiry(mentorsDocuments, inquiry);

  // sum of aggregation query scores and calculated weight based score
  const totalScoredMentors = scoredMentors.map((scoredMentor) => {
    return {
      ...scoredMentor,
      score:
        scoredMentor.score +
        mentorQueryScoreMap.get(scoredMentor.mentor._id.toString()) * 10,
    };
  });

  // sort mentors by score in descending order
  totalScoredMentors.sort((a, b) => b.score - a.score);

  // return the first 8 mentors from the totalScoredMentors array
  return totalScoredMentors.slice(0, 8);
};

/**
 * Create user match document based on matched mentors.
 *
 * @param {string} requestedBy - The ID of the user requesting the match
 * @param {array} matchedMentors - The array of matched mentors with their scores
 * @return A promise that resolves to the created user match
 */
const createUserMatch = async (requestedBy, matchedMentors) => {
  const matches = [];
  matchedMentors.forEach((matchedMentor) => {
    const { score, mentor } = matchedMentor;
    matches.push({
      user: mentor.id,
      name: mentor.name,
      picture: mentor.getProfilePicture(),
      primaryRole: mentor.getPrimaryRole(),
      yearsInClinicalPractice: mentor.getYearsInClinicalPractice(),
      score,
      // TODO: Add remaining fields
    });
  });
  return await insertUserMatch({ requestedBy, matches });
};

export { matchMentors, createUserMatch };
