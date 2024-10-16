import { expressioner } from "..";
import { compareExpressions } from "../expression-comparator";
import { Expression } from "../expressions/expression";
import {
  ReduceNumberContext,
  ReduceNumberEvaluator,
} from "./evaluator.reduce-number";

const a = expressioner.literal(5);
const b = expressioner.literal(-10);
const x = expressioner.variable("x");

const variables = { x: 100 };

describe("single expressions", () => {
  test("fully resolved", () => {
    expectResultOf(a).toResolveToValue(5);
    expectResultOf(b).toResolveToValue(-10);
    expectResultOf(x, variables).toResolveToValue(100);

    expectResultOf(expressioner.add(a, b)).toResolveToValue(-5);
    expectResultOf(expressioner.add(b, a)).toResolveToValue(-5);
    expectResultOf(expressioner.add(a, x), variables).toResolveToValue(105);

    expectResultOf(expressioner.subtract(a, b)).toResolveToValue(15);
    expectResultOf(expressioner.subtract(b, a)).toResolveToValue(-15);
    expectResultOf(expressioner.subtract(a, x), variables).toResolveToValue(
      -95,
    );

    expectResultOf(expressioner.multiply(a, b)).toResolveToValue(-50);
    expectResultOf(expressioner.multiply(b, a)).toResolveToValue(-50);
    expectResultOf(expressioner.multiply(a, x), variables).toResolveToValue(
      500,
    );

    expectResultOf(expressioner.divide(a, b)).toResolveToValue(-0.5);
    expectResultOf(expressioner.divide(b, a)).toResolveToValue(-2);
    expectResultOf(expressioner.divide(a, x), variables).toResolveToValue(0.05);
  });

  test("unresolved", () => {
    expectResultOf(x).toResolveTo(expressioner.variable("x"));
    expectResultOf(expressioner.add(a, x)).toResolveTo(expressioner.add(a, x));
    expectResultOf(expressioner.subtract(a, x)).toResolveTo(
      expressioner.subtract(a, x),
    );
    expectResultOf(expressioner.multiply(a, x)).toResolveTo(
      expressioner.multiply(a, x),
    );
    expectResultOf(expressioner.divide(a, x)).toResolveTo(
      expressioner.divide(a, x),
    );
  });
});

function expectResultOf(
  expression: Expression,
  variables: Record<string, number> = {},
) {
  const result = evaluate(expression, variables);

  return {
    toResolveTo(expression: Expression) {
      expect(result.isError).toBe(false);
      expect(compareExpressions(result.expression, expression)).toBe(true);
    },
    toResolveToValue(value: number) {
      this.toResolveTo(expressioner.literal(value));
    },
  };
}

function evaluate(
  expression: Expression,
  variables: Record<string, number> = {},
) {
  return new ReduceNumberEvaluator(expressioner).evaluate(
    expression,
    new ReduceNumberContext(variables),
  );
}
