import { OperatorExpression, PRIORITIES } from "./expression.operator";

/**
 * An expression that represents a multiplication of other expressions.
 */
export class MultiplyExpression extends OperatorExpression {
  get priority() {
    return PRIORITIES.multiply;
  }

  override get associative() {
    return true;
  }
}
