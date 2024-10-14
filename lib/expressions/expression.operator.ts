import { Expression, ExpressionFactory } from "./expression";

/**
 * The priorities of the operators. A higher number means higher priority.
 *
 * Kept here to easily change the order of operations.
 */
export const PRIORITIES = {
  add: 0,
  subtract: 0,
  multiply: 1,
  divide: 1,
} as const;

export abstract class OperatorExpression extends Expression {
  constructor(
    expressionFactory: ExpressionFactory,
    public readonly left: Expression,
    public readonly right: Expression,
  ) {
    super(expressionFactory, [left, right]);
  }

  /**
   * Returns the priority of the expression. A smaller number means higher priority.
   */
  abstract get priority(): (typeof PRIORITIES)[keyof typeof PRIORITIES];

  /**
   * Returns whether the operator is associative or not.
   * That is, whether if `(a op b) op c` is the same as `a op (b op c)`.
   *
   * Used for some optimizations.
   */
  abstract get associative(): boolean;
}
