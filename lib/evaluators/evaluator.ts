import { Expression, ExpressionFactory } from "../expressions/expression";
import { AddExpression } from "../expressions/expression.add";
import { DivideExpression } from "../expressions/expression.divide";
import { LiteralExpression } from "../expressions/expression.literal";
import { MultiplyExpression } from "../expressions/expression.multiply";
import { SubtractExpression } from "../expressions/expression.subtract";
import { VariableExpression } from "../expressions/expression.variable";

/**
 * Base class for all evaluators.
 *
 * Evaluators are the core classes for {@link Expression} AST processing.
 * They may be using to both returning a result, modify the AST, or cause side-effects, like drawing.
 *
 * Implementers should override the methods for the specific expressions they want to support.
 */
export abstract class Evaluator<ContextType, ReturnType> {
  constructor(protected readonly expressionFactory: ExpressionFactory) {}

  /**
   * Main entry point for evaluating an expression with the evaluator.
   *
   * This method shouldn't be overriden, as it's the one that dispatches the evaluation to the specific methods.
   */
  public evaluate(expression: Expression, context: ContextType): ReturnType {
    if (expression instanceof LiteralExpression) {
      return this.evaluateLiteral(expression, context);
    }

    if (expression instanceof VariableExpression) {
      return this.evaluateVariable(expression, context);
    }

    if (expression instanceof AddExpression) {
      return this.evaluateAdd(expression, context);
    }

    if (expression instanceof SubtractExpression) {
      return this.evaluateSubtract(expression, context);
    }

    if (expression instanceof MultiplyExpression) {
      return this.evaluateMultiply(expression, context);
    }

    if (expression instanceof DivideExpression) {
      return this.evaluateDivide(expression, context);
    }

    throw new Error(
      "Unsupported expression type: " + expression.constructor.name,
    );
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */

  protected evaluateLiteral(
    expression: LiteralExpression,
    context: ContextType,
  ): ReturnType {
    throw new Error("Not implemented");
  }

  protected evaluateVariable(
    expression: VariableExpression,
    context: ContextType,
  ): ReturnType {
    throw new Error("Not implemented");
  }

  protected evaluateAdd(
    expression: AddExpression,
    context: ContextType,
  ): ReturnType {
    throw new Error("Not implemented");
  }

  protected evaluateSubtract(
    expression: SubtractExpression,
    context: ContextType,
  ): ReturnType {
    throw new Error("Not implemented");
  }

  protected evaluateMultiply(
    expression: MultiplyExpression,
    context: ContextType,
  ): ReturnType {
    throw new Error("Not implemented");
  }

  protected evaluateDivide(
    expression: DivideExpression,
    context: ContextType,
  ): ReturnType {
    throw new Error("Not implemented");
  }

  /* eslint-enable @typescript-eslint/no-unused-vars */
}
