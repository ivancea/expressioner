import { expressioner } from "..";
import { Expression } from "../expressions/expression";
import { TextEvaluator } from "./evaluator.text";

test("single expressions", () => {
  const a = expressioner.literal(5);
  const b = expressioner.literal(-7);

  expect(evaluate(a)).toBe("5");
  expect(evaluate(b)).toBe("-7");

  expect(evaluate(expressioner.add(a, b))).toBe("5 + (-7)");
  expect(evaluate(expressioner.add(b, a))).toBe("-7 + 5");

  expect(evaluate(expressioner.subtract(a, b))).toBe("5 - (-7)");
  expect(evaluate(expressioner.subtract(b, a))).toBe("-7 - 5");

  expect(evaluate(expressioner.multiply(a, b))).toBe("5 * (-7)");
  expect(evaluate(expressioner.multiply(b, a))).toBe("-7 * 5");

  expect(evaluate(expressioner.divide(a, b))).toBe("5 / (-7)");
  expect(evaluate(expressioner.divide(b, a))).toBe("-7 / 5");
});

function evaluate(expression: Expression) {
  return new TextEvaluator().evaluate(expression, undefined);
}
