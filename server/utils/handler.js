/**
 * Wraps an Express request handler to enable full req/res IntelliSense
 * without needing JSDoc annotations on every function.
 * @param {import('express').RequestHandler} fn
 * @returns {import('express').RequestHandler}
 */
const handler = (fn) => fn;

module.exports = handler;
