import { isNil } from "lodash-es";
import { Expression, ExpressionFactory } from "../expressions/expression";
import { AddExpression } from "../expressions/expression.add";
import { DivideExpression } from "../expressions/expression.divide";
import { LiteralExpression } from "../expressions/expression.literal";
import { MultiplyExpression } from "../expressions/expression.multiply";
import { OperatorExpression } from "../expressions/expression.operator";
import { SubtractExpression } from "../expressions/expression.subtract";
import { VariableExpression } from "../expressions/expression.variable";
import { Evaluator } from "./evaluator";

export class ReduceNumberEvaluator extends Evaluator<
  ReduceNumberContext,
  ReduceNumberResult
> {
  constructor(protected readonly expressionFactory: ExpressionFactory) {
    super();
  }

  protected override evaluateLiteral(
    expression: LiteralExpression,
  ): ReduceNumberResult {
    return ReduceNumberResult.forExpression(expression);
  }

  protected override evaluateVariable(
    expression: VariableExpression,
    context: ReduceNumberContext,
  ): ReduceNumberResult {
    const value = context.variables[expression.name];

    if (isNil(value)) {
      return ReduceNumberResult.forExpression(expression);
    }

    return ReduceNumberResult.forExpression(
      this.expressionFactory.literal(value),
    );
  }

  protected override evaluateAdd(
    expression: AddExpression,
    context: ReduceNumberContext,
  ): ReduceNumberResult {
    return this.evaluateOperator(
      expression,
      context,
      (left, right) => left + right,
      (left, right) => this.expressionFactory.add(left, right),
    );
  }

  protected override evaluateSubtract(
    expression: SubtractExpression,
    context: ReduceNumberContext,
  ): ReduceNumberResult {
    return this.evaluateOperator(
      expression,
      context,
      (left, right) => left - right,
      (left, right) => this.expressionFactory.subtract(left, right),
    );
  }

  protected override evaluateMultiply(
    expression: MultiplyExpression,
    context: ReduceNumberContext,
  ): ReduceNumberResult {
    return this.evaluateOperator(
      expression,
      context,
      (left, right) => left * right,
      (left, right) => this.expressionFactory.multiply(left, right),
    );
  }

  protected override evaluateDivide(
    expression: DivideExpression,
    context: ReduceNumberContext,
  ): ReduceNumberResult {
    return this.evaluateOperator(
      expression,
      context,
      (left, right) => left / right,
      (left, right) => this.expressionFactory.divide(left, right),
    );
  }

  private evaluateOperator(
    expression: OperatorExpression,
    context: ReduceNumberContext,
    accumulate: (valueA: number, valueB: number) => number,
    rebuild: (expressionA: Expression, expressionB: Expression) => Expression,
  ): ReduceNumberResult {
    const left = this.evaluate(expression.left, context);
    const right = this.evaluate(expression.right, context);

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
      return ReduceNumberResult.forExpression(
        this.expressionFactory.literal(
          accumulate(left.expression.value, right.expression.value),
        ),
      );
    }

    if (
      left.expression !== expression.left ||
      right.expression !== expression.right
    ) {
      return ReduceNumberResult.forExpression(
        rebuild(left.expression, right.expression),
      );
    }

    return ReduceNumberResult.forExpression(expression);
  }
}

export class ReduceNumberContext {
  constructor(public readonly variables: Record<string, number> = {}) {}
}

export class ReduceNumberResult {
  static forExpression(expression: Expression): ReduceNumberResult {
    return new ReduceNumberResult(expression);
  }
  static forError(error: Error): ReduceNumberResult {
    return new ReduceNumberResult(undefined, error);
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
