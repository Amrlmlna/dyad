export const IS_TEST_BUILD = (typeof process !== 'undefined' && process.env?.E2E_TEST_BUILD === "true") || false;
