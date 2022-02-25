import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess'

/**
 * Run any svelte preprocessor in the markup phase.
 * @param preprocessors The preprocessors to run.
 */
export declare function asMarkupPreprocessor(
  preprocessors: PreprocessorGroup | PreprocessorGroup[]
): PreprocessorGroup
