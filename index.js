import { preprocess } from 'svelte/compiler'

/** @type {import('.').asMarkupPreprocessor} */
export function asMarkupPreprocessor(preprocessors) {
  return {
    async markup({ content, filename }) {
      return preprocess(content, preprocessors, { filename })
    }
  }
}
