import {
  EvaluationContext,
  Expression,
  ExpressionFactory,
} from "./expressions/expression";
import { AddExpression } from "./expressions/expression.add";
import { LiteralExpression } from "./expressions/expression.literal";
import { MultiplyExpression } from "./expressions/expression.multiply";

const expressionFactory: ExpressionFactory = {
  literal(value: number) {
    return new LiteralExpression(expressionFactory, value);
  },
  add(expressions: Expression[]) {
    return new AddExpression(expressionFactory, expressions);
  },
  multiply(expressions: Expression[]) {
    return new MultiplyExpression(expressionFactory, expressions);
  },
};

export const expressioner = {
  ...expressionFactory,

  toNumber(expression: Expression): number {
    const result = expression.evaluate(new EvaluationContext());

    if (result.isError) {
      throw result.error;
    }

    if (result.expression instanceof LiteralExpression) {
      return result.expression.value;
    }

    throw new Error("Expression couldn't be resolved to a number");
  },

  toText(expression: Expression): string {
    return expression.toText();
  },
};
