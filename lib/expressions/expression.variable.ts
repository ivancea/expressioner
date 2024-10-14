import { Expression, ExpressionFactory } from "./expression";

/**
 * An expression that represents a variable.
 */
export class VariableExpression extends Expression {
  constructor(
    expressionFactory: ExpressionFactory,
    public readonly name: string,
  ) {
    super(expressionFactory, []);
  }
}
