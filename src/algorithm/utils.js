export const createMatchRegex = (str) => new RegExp(str, "i");

/**
 * Calculate the match score between two arrays based on the specified weight.
 *
 * @param {Array} arr1 - The first array
 * @param {Array} arr2 - The second array
 * @param {number} weight - The weight for the match score calculation
 * @return {number} The match score
 */
export const getArrayMatchScore = (arr1, arr2, weight) => {
  let score = 0;
  if (!arr1 || !arr2) {
    return 0;
  }
  arr1.forEach((item) => {
    if(arr2.includes(item)) {
      score += weight;
    }
    arr2.forEach((item2) => {
      if (createMatchRegex(item).test(item2)) {
        score += (weight / 2);
      }
    });
  });
  return score;
};

/**
 * Calculate the match score between two strings based on a given weight.
 *
 * @param {string} str1 - The first string to compare.
 * @param {string} str2 - The second string to compare.
 * @param {number} weight - The weight to apply to the match score.
 * @return {number} The match score between the two strings.
 */
export const getStringMatchScore = (str1, str2, weight) => {
  if (!str1 || !str2) {
    return 0;
  }
  if (str1 == str2) {
    return weight;
  }
  if (createMatchRegex(str1).test(str2)) {
    return weight / 2;
  }
  return 0;
};