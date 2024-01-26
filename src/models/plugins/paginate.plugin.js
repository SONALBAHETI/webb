import paginate from "mongoose-paginate-v2";
/**
 * Pagination metadata for a MongoDB query result.
 * @typedef {Object} PaginationResult
 * @property {Array} docs - Array of documents
 * @property {Number} totalDocs - Total number of documents in the collection that match a query
 * @property {Number} limit - Limit that was used
 * @property {Boolean} hasPrevPage - Availability of the previous page.
 * @property {Boolean} hasNextPage - Availability of the next page.
 * @property {Number} page - Current page number
 * @property {Number} totalPages - Total number of pages.
 * @property {Number} offset - Only if specified or default page/offset values were used
 * @property {Number|null} prevPage - Previous page number if available or NULL
 * @property {Number|null} nextPage - Next page number if available or NULL
 * @property {Number} pagingCounter - The starting index/serial/chronological number of the first document in the current page.
 *                                   (E.g., if page=2 and limit=10, then pagingCounter will be 11)
 * @property {Object} meta - Object of pagination metadata (Default false).
 */

/**
 * Options for querying a MongoDB collection with pagination using Mongoose.
 * @typedef {Object} PaginationOptions
 * @property {Object} [select] - Fields to return (by default returns all fields). Documentation
 * @property {Object} [collation] - Specify the collation Documentation
 * @property {Object | String} [sort] - Sort order. Documentation
 * @property {Array | Object | String} [populate] - Paths which should be populated with other documents. Documentation
 * @property {String | Object} [projection] - Get/set the query projection. Documentation
 * @property {Boolean} [lean=false] - Should return plain JavaScript objects instead of Mongoose documents? Documentation
 * @property {Boolean} [leanWithId=true] - If lean and leanWithId are true, adds id field with the string representation of _id to every document.
 * @property {Number} [offset=0] - Use offset or page to set skip position
 * @property {Number} [page=1]
 * @property {Number} [limit=10]
 * @property {Object} [customLabels] - Developers can provide custom labels for manipulating the response data.
 * @property {Boolean} [pagination=true] - If pagination is set to false, it will return all docs without adding a limit condition. (Default: True)
 * @property {Boolean} [useEstimatedCount=false] - Enable estimatedDocumentCount for larger datasets.
 *                                                Does not count based on given query, so the count will match entire collection size. (Default: False)
 * @property {Boolean} [useCustomCountFn=false] - Enable custom function for count datasets. (Default: False)
 * @property {Boolean} [forceCountFn=false] - Set this to true if you need to support $geo queries. (Default: False)
 * @property {String} [customFind='find'] - Method name for the find method which is called from the Model object.
 *                                         This option can be used to change default behavior for pagination in case of different use cases (like mongoose-soft-delete). (Default 'find')
 * @property {Boolean} [allowDiskUse=false] - Set this to true, which allows the MongoDB server to use more than 100 MB for the query.
 *                                           This option can let you work around QueryExceededMemoryLimitNoDiskUseAllowed errors from the MongoDB server. (Default: False)
 * @property {Object} [read] - Determines the MongoDB nodes from which to read. Below are the available options.
 * @property {String} [pref] - One of the listed preference options or aliases.
 * @property {Object} [tags] - Optional tags for this query. (Must be used with [pref])
 * @property {Object} [options] - Options passed to Mongoose's find() function. Documentation
 * @property {function} [callback(err, result)] - If specified, the callback is called once pagination results are retrieved.
 */

export { paginate };
