# Proposals

## Prelude: Function

- add `addIndex` - convert a unary map into augmented map with index
  ```
  addIndex :: ((a -> b) -> c -> d) -> (a -> Number -> b) -> c -> d
  ```
- add `once` (and similar `once2` - `once9`) utility functions
  Implementation pending, see `src/Function.mad` for more details on attempts

- alias `equals` to `is` and `notEquals` to `isNot`
  Shorter and the grammarian in me hates `notEquals`

## Prelude: String

- add `startsWith` / `endsWith` - argument: anything in String.prototype should be made functional
  file under *ramda-shorthand*

```
startsWith :: String -> String -> Boolean
export startsWith = (needle, haystack) => #- haystack.startsWith(needle) -#
endsWith :: String -> String -> Boolean
export endsWith = (needle, haystack) => #- haystack.endsWith(needle) -#
```

### module: Debug

In this branch I've done some stuff to make automatic logging possible. I would like to have a more robust approach, but the current idea is around frontloading / partially-applying a logger + "should-log" conditional and some way of applying those to sub-functions. That is, if I have a way of passing state (in the form of "when to log") down to sub-functions I can have more granular conditional logging without changing internals; money for nothing and effects for free:

```
pipe(
  traceWhen(traceState, `${myFunction} input`),
  myFunction,
  traceWhen(traceState, `${myFunction} output`)
)
```

#### Minor Gripes / Developer Experience

Things which felt like they could be improved but my personal preferences may be adding a bias. Open to arguments for / against. (Also I know some have already been discussed, just adding everything so there's more datapoints captured on paper while still fresh in my mind.)

- Unary functions shouldn't require the parens: `s => ()`
  - coming from JS this is minor but would definitely lower potential friction
- Nested unaries aren't grammatically valid: `(a) => (b) => (//[...]`
  - something unexpected: yes.
  - could it be that I shouldn't have been trying what I was trying? also yes.
  - seems also like something which might fuck up the automatic curry / uncurry stuff
- implicit returns feel weird inside curly braces: `(a) => { a }`
  - implicit returns are weird to me
- `where` syntax is slightly confusing in a specific context:
  ```
  where {
    Just(x) => x
    Nothing => false
  }
  ```
  vs. what my brain expected:
  ```
  where {
    Just(x)   => x
    Nothing() => false
  }
  ```

#### Ideas

- "Use code as example for exemplary code" bootstrap: we should keep tabs on simple-and-idiomatic madlib code so we can direct new learners to code that is working in production and uses some idiomatic madlib code.
  - i.e. `lookForMatches` and the `Match` type definition

```
selectFrom = (routes, routeParts) => addIndex(map)(
  (_, i) => nth(i, routes)
)(routeParts)

type Match = ExplicitMatch(List String) | WildcardMatch (List String) | NoMatch

lookForMatches :: List (List String) -> List String -> List Match
export lookForMatches = (routes, given) => ifElse(
  any(startsWith(':')),
  always([WildcardMatch(given)]),
  pipe(
    selectFrom(routes),
    map(where {
      Just(x) => ExplicitMatch(x)
      Nothing => NoMatch
    })
  )
)(given)
```
