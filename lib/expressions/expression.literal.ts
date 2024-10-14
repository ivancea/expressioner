import { Expression, ExpressionFactory } from "./expression";

/**
 * An expression that represents a literal number.
 *
 * Leaf node of the expression tree, and also the simplest result of an evaluation.
 */
export class LiteralExpression extends Expression {
  constructor(
    expressionFactory: ExpressionFactory,
    public readonly value: number,
  ) {
    super(expressionFactory, []);
  }
}
