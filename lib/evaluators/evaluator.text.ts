import { Expression } from "../expressions/expression";
import { AddExpression } from "../expressions/expression.add";
import { DivideExpression } from "../expressions/expression.divide";
import { LiteralExpression } from "../expressions/expression.literal";
import { MultiplyExpression } from "../expressions/expression.multiply";
import { OperatorExpression } from "../expressions/expression.operator";
import { SubtractExpression } from "../expressions/expression.subtract";
import { Evaluator } from "./evaluator";

export class TextEvaluator extends Evaluator<undefined, string> {
  protected override evaluateLiteral(expression: LiteralExpression): string {
    return expression.value.toString();
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
      parent instanceof OperatorExpression &&
      child instanceof OperatorExpression &&
      child.children.length > 1 &&
      (parent.priority > child.priority ||
        (parent.priority == child.priority &&
          index > 0 &&
          (parent.constructor != child.constructor || !parent.associative)))
    ) {
      return `(${childText})`;
    }

    return childText;
  }
}
