# Expressioner

Library to create and evaluate expressions in dynamic ways:

- Get the result from an expression given the values for its variables
- Convert it to text
- Render it in a canvas
- Make your own `Evaluator` to work with the expression

## Structure

Expressioner is made of 2 main modules:

### Expressions (AST)

The expressions AST is the core of the library, and will help you represent any kind of expression you need.

They have no logic, it's just a structure.

### Evaluators

Evaluators are visitors at its core, and each of them will evaluate the expression in a different way.

You can build your own, but there are some built-ins:

#### `TextEvaluator`

Converts an expression to a string.

#### `ReduceNumberEvaluator`

Resolves an expression to a number.
In case the expression cannot be resolved (There may be variables without value), an optimized AST will be returned.

## How to use

There's an example in the `example` folder you can build with `npm start`.
No server is started, so you'll have to open the `build/index.html` file in your browser.

## Roadmap

- Add a parser for the expressions , that would generate the syntax tree. It would use https://github.com/ivancea/syntaxer
