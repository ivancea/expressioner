/**
 * The base class of all expressions.
 *
 * To compose expressions, use the available methods here.
 */
export abstract class Expression {
  constructor(
    public readonly expressionFactory: ExpressionFactory,
    public readonly children: Expression[],
  ) {}

  draw(): void {
    throw new Error("Draw not supported yet");
  }

  add(expression: Expression): Expression {
    return this.expressionFactory.add(this, expression);
  }

  subtract(expression: Expression): Expression {
    return this.expressionFactory.subtract(this, expression);
  }

  multiply(expression: Expression): Expression {
    return this.expressionFactory.multiply(this, expression);
  }

  divide(expression: Expression): Expression {
    return this.expressionFactory.divide(this, expression);
  }
}

export type ExpressionFactory = {
  literal(value: number): Expression;
  add(...expressions: Expression[]): Expression;
  subtract(left: Expression, right: Expression): Expression;
  multiply(...expressions: Expression[]): Expression;
  divide(left: Expression, right: Expression): Expression;
};
