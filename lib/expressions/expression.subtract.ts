import { OperatorExpression, PRIORITIES } from "./expression.operator";

/**
 * An expression that represents a subtraction of other expressions.
 */
export class SubtractExpression extends OperatorExpression {
  override get priority() {
    return PRIORITIES.subtract;
  }

  override get associative() {
    return false;
  }
}
