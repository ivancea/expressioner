import {
  ReduceNumberContext,
  ReduceNumberEvaluator,
} from "./evaluators/evaluator.reduce-number";
import { TextEvaluator } from "./evaluators/evaluator.text";
import { Expression, ExpressionFactory } from "./expressions/expression";
import { AddExpression } from "./expressions/expression.add";
import { DivideExpression } from "./expressions/expression.divide";
import { LiteralExpression } from "./expressions/expression.literal";
import { MultiplyExpression } from "./expressions/expression.multiply";
import { SubtractExpression } from "./expressions/expression.subtract";
import { VariableExpression } from "./expressions/expression.variable";

const expressionFactory: ExpressionFactory = {
  literal(value: number) {
    return new LiteralExpression(expressionFactory, value);
  },
  variable(name: string) {
    return new VariableExpression(expressionFactory, name);
  },
  add(left: Expression, right: Expression) {
    return new AddExpression(expressionFactory, left, right);
  },
  subtract(left: Expression, right: Expression) {
    return new SubtractExpression(expressionFactory, left, right);
  },
  multiply(left: Expression, right: Expression) {
    return new MultiplyExpression(expressionFactory, left, right);
  },
  divide(left: Expression, right: Expression) {
    return new DivideExpression(expressionFactory, left, right);
  },
};

export const expressioner = {
  ...expressionFactory,

  toNumber(
    expression: Expression,
    variables: Record<string, number> = {},
  ): number {
    const result = new ReduceNumberEvaluator(expressionFactory).evaluate(
      expression,
      new ReduceNumberContext(variables),
    );

    if (result.isError) {
      throw result.error;
    }

    if (result.expression instanceof LiteralExpression) {
      return result.expression.value;
    }

    throw new Error("Expression couldn't be resolved to a number");
  },

  toText(expression: Expression): string {
    return new TextEvaluator(expressionFactory).evaluate(expression, undefined);
  },
};
