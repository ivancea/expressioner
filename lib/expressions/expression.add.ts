import { OperatorExpression, PRIORITIES } from "./expression.operator";

/**
 * An expression that represents an addition of other expressions.
 */
export class AddExpression extends OperatorExpression {
  override get priority() {
    return PRIORITIES.add;
  }

  override get associative() {
    return true;
  }
}
