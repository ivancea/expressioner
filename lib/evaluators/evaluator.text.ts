import { Expression } from "../expressions/expression";
import { AddExpression } from "../expressions/expression.add";
import { DivideExpression } from "../expressions/expression.divide";
import { LiteralExpression } from "../expressions/expression.literal";
import { MultiplyExpression } from "../expressions/expression.multiply";
import { OperatorExpression } from "../expressions/expression.operator";
import { SubtractExpression } from "../expressions/expression.subtract";
import { VariableExpression } from "../expressions/expression.variable";
import { Evaluator } from "./evaluator";

export class TextEvaluator extends Evaluator<undefined, string> {
  protected override evaluateLiteral(expression: LiteralExpression): string {
    return expression.value.toString();
  }
  protected override evaluateVariable(expression: VariableExpression): string {
    return expression.name;
  }

  protected override evaluateAdd(expression: AddExpression): string {
    return expression.children
      .map((child, index) =>
        this.evaluateParenthesized(expression, child, index),
      )
      .join(" + ");
  }

  protected override evaluateSubtract(expression: SubtractExpression): string {
    return expression.children
      .map((child, index) =>
        this.evaluateParenthesized(expression, child, index),
      )
      .join(" - ");
  }

  protected override evaluateMultiply(expression: MultiplyExpression): string {
    return expression.children
      .map((child, index) =>
        this.evaluateParenthesized(expression, child, index),
      )
      .join(" * ");
  }

  protected override evaluateDivide(expression: DivideExpression): string {
    return expression.children
      .map((child, index) =>
        this.evaluateParenthesized(expression, child, index),
      )
      .join(" / ");
  }

  private evaluateParenthesized(
    parent: Expression,
    child: Expression,
    index: number,
  ): string {
    const childText = this.evaluate(child, undefined);

    if (!(parent instanceof OperatorExpression)) {
      return this.evaluate(child, undefined);
    }

    if (
      // Cases like a * b + c
      parent instanceof OperatorExpression &&
      ((child instanceof OperatorExpression &&
        // Either a * (b + c)
        (parent.priority > child.priority ||
          // Or a * b / c
          (parent.priority == child.priority &&
            // The first operand won't need parentheses, like a + b / c. Left-to-right order is correct
            index > 0 &&
            // If both are the same associative operation, they won't need parentheses: a * b * c
            (parent.constructor != child.constructor ||
              !parent.associative)))) ||
        // Negative values as the second operand will need parentheses: a + (-b)
        (child instanceof LiteralExpression && child.value < 0 && index > 0))
    ) {
      return `(${childText})`;
    }

    return childText;
  }
}
