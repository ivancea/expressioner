import { Expression } from "../expressions/expression";
import { AddExpression } from "../expressions/expression.add";
import { DivideExpression } from "../expressions/expression.divide";
import { LiteralExpression } from "../expressions/expression.literal";
import { MultiplyExpression } from "../expressions/expression.multiply";
import { OperatorExpression } from "../expressions/expression.operator";
import { SubtractExpression } from "../expressions/expression.subtract";
import { Evaluator } from "./evaluator";

export class ReduceNumberEvaluator extends Evaluator<
  undefined,
  EvaluationResult
> {
  protected override evaluateLiteral(
    expression: LiteralExpression,
  ): EvaluationResult {
    return EvaluationResult.forExpression(expression);
  }

  protected override evaluateAdd(expression: AddExpression): EvaluationResult {
    return this.evaluateOperator(
      expression,
      (left, right) => left + right,
      (left, right) => expression.expressionFactory.add(left, right),
    );
  }

  protected override evaluateSubtract(
    expression: SubtractExpression,
  ): EvaluationResult {
    return this.evaluateOperator(
      expression,
      (left, right) => left - right,
      (left, right) => expression.expressionFactory.subtract(left, right),
    );
  }

  protected override evaluateMultiply(
    expression: MultiplyExpression,
  ): EvaluationResult {
    return this.evaluateOperator(
      expression,
      (left, right) => left * right,
      (left, right) => expression.expressionFactory.multiply(left, right),
    );
  }

  protected override evaluateDivide(
    expression: DivideExpression,
  ): EvaluationResult {
    return this.evaluateOperator(
      expression,
      (left, right) => left / right,
      (left, right) => expression.expressionFactory.divide(left, right),
    );
  }

  private evaluateOperator(
    expression: OperatorExpression,
    accumulate: (valueA: number, valueB: number) => number,
    rebuild: (expressionA: Expression, expressionB: Expression) => Expression,
  ): EvaluationResult {
    const left = this.evaluate(expression.left, undefined);
    const right = this.evaluate(expression.right, undefined);

    if (left.isError) {
      return left;
    }

    if (right.isError) {
      return right;
    }

    if (
      left.expression instanceof LiteralExpression &&
      right.expression instanceof LiteralExpression
    ) {
      return EvaluationResult.forExpression(
        expression.expressionFactory.literal(
          accumulate(left.expression.value, right.expression.value),
        ),
      );
    }

    if (
      left.expression !== expression.left ||
      right.expression !== expression.right
    ) {
      return EvaluationResult.forExpression(
        rebuild(left.expression, right.expression),
      );
    }

    return EvaluationResult.forExpression(expression);
  }
}

export class EvaluationResult {
  static forExpression(expression: Expression): EvaluationResult {
    return new EvaluationResult(expression);
  }
  static forError(error: Error): EvaluationResult {
    return new EvaluationResult(undefined, error);
  }

  private constructor(
    private readonly expressionInternal?: Expression,
    private readonly errorInternal?: Error,
  ) {}

  get isError(): boolean {
    return this.errorInternal !== undefined;
  }

  /**
   * The resulting expression. Throws if there's an error.
   */
  get expression(): Expression {
    if (!this.expressionInternal) {
      throw new Error("No expression");
    }

    return this.expressionInternal;
  }

  /**
   * The resulting error. Throws if there's an expression.
   */
  get error(): Error {
    if (!this.errorInternal) {
      throw new Error("No error");
    }

    return this.errorInternal;
  }
}
