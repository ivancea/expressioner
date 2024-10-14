import { OperatorExpression, PRIORITIES } from "./expression.operator";

/**
 * An expression that represents a division of other expressions.
 */
export class DivideExpression extends OperatorExpression {
  override get priority() {
    return PRIORITIES.divide;
  }

  override get associative() {
    return false;
  }
}
