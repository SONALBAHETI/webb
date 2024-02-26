/**
 * Recursively merges multiple objects into a single object.
 *
 * @param {Object} target - The target object to merge into.
 * @param {...Object} sources - The source objects to merge from.
 */
const deepMerge = (target, ...sources) => {
  // Iterate over all source objects
  for (const source of sources) {
    if (!source || typeof source !== "object") {
      continue; // Skip invalid source
    }
    // Iterate over all properties in the current source object
    Object.keys(source).forEach((key) => {
      // Check if the current property is an object and needs further merging
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        typeof target[key] === "object" &&
        target[key] !== null &&
        !Array.isArray(source[key])
      ) {
        // Recursively merge nested objects
        deepMerge(target[key], source[key]);
      } else {
        // Perform a shallow copy of the property
        target[key] = source[key];
      }
    });
  }
};

export default deepMerge;
