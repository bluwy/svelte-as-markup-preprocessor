# asMarkupPreprocessor

Run any svelte preprocessor in the markup phase.
Useful anytime you have a markup preprocessor that needs to run
after a style or script preprocessor.

# Usage
To use, simply wrap all preprocessors above the
the dependent preprocessor like so
```js
// svelte.config.js
import asMarkupPreprocessor from 'svelte-as-markup-preprocessor'
module.exports = {
  preprocess: [
    asMarkupPreprocessor([
      sveltePreprocess(),
      otherPreprocessors
    ]),
      dependentMarkupPreprocessor()
  ]
}
```

`asMarkupPreprocessor` is a simple wrapper around [svelte.preprocess](https://svelte.dev/docs#svelte_preprocess), and thus accepts the same arguments as it. If you can put it in [svelte.config.js](https://github.com/sveltejs/language-tools/blob/master/docs/preprocessors/in-general.md)'s `preprocess` field, you can pass it into us.


# Motivation

This was initially written for a preprocessor that walks svelte's ast using
`svelte.parse` and `svelte.walk`. As those only work on pure svelte files, this was needed to run the all other preprocessors to completion first.


# Why is this needed?

Normally, svelte runs its preprocessors in 2 phases. The markup phase, and the script/style phase. The markup phase runs first, and
*all markup preprocessors run before any script/style preprocessors!*

This means with this setup
```js
// svelte.config.js
module.exports = {
  preprocess: [
    preprocessor_1(),
    preprocessor_2(),
    preprocessor_3()
  ]
}
```
The preprocessors will run in this order
```js
await preprocessor_1.markup()
await preprocessor_2.markup()
await preprocessor_3.markup()
await Promise.all([
  (async()=>{
    await preprocessor_1.style()
    await preprocessor_2.style()
    await preprocessor_3.style()
  })(),
  (async()=>{
    await preprocessor_1.script()
    await preprocessor_2.script()
    await preprocessor_3.script()
  })()
])
```
As you can see, preprocessor_2 and preprocessor_3's markup preprocessor ran *before* preprocessor_1's script and style preprocessors.

We act as a wrapper and change the run order.
All preprocessors passed into us finish in our markup phase,
guaranteeing that they have run before the any preprocessors that run after us. For example

```js
// svelte.config.js
module.exports = {
  preprocess: [
    asMarkupPreprocessor([
      preprocessor_1(),
      preprocessor_2()
    ]),
    preprocessor_3()
  ]
}
```
Will changing the run order to
```js
await ({async markup() {
  await preprocessor_1.markup()
  await preprocessor_2.markup() 
  await Promise.all([
    (async()=>{
      await preprocessor_1.style()
      await preprocessor_2.style()
    })(),
    (async()=>{
      await preprocessor_1.script()
      await preprocessor_2.script()
    })()
  ])
}}).markup()
await preprocessor_3.markup()
await Promise.all([
  (async()=>{
    await preprocessor_3.style()
  })(),
  (async()=>{
    await preprocessor_3.script()
  })()
])
```
Now preprocessor_3 does not run until after both preprocessor_1 and preprocessor_2 have finished preprocessing the markup, script, and style!