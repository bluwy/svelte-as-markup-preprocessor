import { preprocess } from 'svelte/compiler'

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type PreprocessFn = typeof preprocess
type Processed = ThenArg<ReturnType<PreprocessFn>>
type PreprocessParams = Parameters<PreprocessFn>
type PreprocessorGroup = Exclude<PreprocessParams[1] ,unknown[]>

/**
 * Run any svelte preprocessor in the markup phase.
 * @param preprocessors The preprocessors to run.
 */

// eslint-disable-next-line max-len
export function asMarkupPreprocessor(preprocessors: PreprocessorGroup|PreprocessorGroup[]): PreprocessorGroup {
  return {
    async markup({ content ,filename }): Promise<Processed> {
      return preprocess(content ,preprocessors ,{ filename })
    }
  }
}
