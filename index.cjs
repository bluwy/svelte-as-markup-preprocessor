import { preprocess } from 'svelte/compiler'

/** @type {import('.').asMarkupPreprocessor} */
function asMarkupPreprocessor(preprocessors) {
  return {
    async markup({ content, filename }) {
      return preprocess(content, preprocessors, { filename })
    }
  }
}

module.exports.asMarkupPreprocessor = asMarkupPreprocessor
