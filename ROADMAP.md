# Roadmap

## Planned

## Potential

### Parser for expressions

- A parser for expressions that can be used to evaluate expressions in a string format.
- The parser could be done ad-hoc or with a library

#### Ad-hoc parser

JS-based parser. The parser would work similar to a visitor. It would be configured with a set of rules, and would try to match them.

Each rule would have an unique name, and a resolving function.
Each of those functins would call the "resolveAny()" method from the resolver class, provided to them.

Example:

```javascript
{
  "where": (expression, resolveAny) => {
    const _ = resolveAny(keyword("where"));

    const expressionList = resolveAny("expression_list");

    return x; // Custom return object
  },
}
```

The resolveAny would throw if it couldn't resolve any of the rules. It will catch exceptions and try with the next provided rule.

There would be helpers, like the "keyword()" function, that would match any keyword that wouldn't need to be defined.

Or it could be like:

```javascript
{
  "where": (expression, resolve) => {
    const _ = resolve.keyword("where");

    const expressionList = resolve.any("expression_list");

    return x; // Custom return object
  },
}
```

For simplicity.
