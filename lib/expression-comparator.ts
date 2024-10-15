import { Expression } from "./expressions/expression";
import { AddExpression } from "./expressions/expression.add";
import { DivideExpression } from "./expressions/expression.divide";
import { LiteralExpression } from "./expressions/expression.literal";
import { MultiplyExpression } from "./expressions/expression.multiply";
import { OperatorExpression } from "./expressions/expression.operator";
import { SubtractExpression } from "./expressions/expression.subtract";
import { VariableExpression } from "./expressions/expression.variable";

export function compareExpressions(
  expressionA: Expression,
  expressionB: Expression,
): boolean {
  if (expressionA.constructor !== expressionB.constructor) {
    return false;
  }

  if (expressionA instanceof LiteralExpression) {
    return compareLiteralExpressions(
      expressionA,
      expressionB as LiteralExpression,
    );
  }

  if (expressionA instanceof VariableExpression) {
    return compareVariableExpressions(
      expressionA,
      expressionB as VariableExpression,
    );
  }

  if (expressionA instanceof AddExpression) {
    return compareAddExpressions(expressionA, expressionB as AddExpression);
  }

  if (expressionA instanceof SubtractExpression) {
    return compareSubtractExpressions(
      expressionA,
      expressionB as SubtractExpression,
    );
  }

  if (expressionA instanceof MultiplyExpression) {
    return compareMultiplyExpressions(
      expressionA,
      expressionB as MultiplyExpression,
    );
  }

  if (expressionA instanceof DivideExpression) {
    return compareDivideExpressions(
      expressionA,
      expressionB as DivideExpression,
    );
  }

  throw new Error(
    "Unsupported expression type: " + expressionA.constructor.name,
  );
}

function compareLiteralExpressions(
  expressionA: LiteralExpression,
  expressionB: LiteralExpression,
) {
  return expressionA.value === expressionB.value;
}

function compareVariableExpressions(
  expressionA: VariableExpression,
  expressionB: VariableExpression,
) {
  return expressionA.name === expressionB.name;
}

function compareAddExpressions(
  expressionA: AddExpression,
  expressionB: AddExpression,
) {
  return compareOperatorExpressions(expressionA, expressionB);
}

function compareSubtractExpressions(
  expressionA: SubtractExpression,
  expressionB: SubtractExpression,
) {
  return compareOperatorExpressions(expressionA, expressionB);
}

function compareMultiplyExpressions(
  expressionA: MultiplyExpression,
  expressionB: MultiplyExpression,
) {
  return compareOperatorExpressions(expressionA, expressionB);
}

function compareDivideExpressions(
  expressionA: DivideExpression,
  expressionB: DivideExpression,
) {
  return compareOperatorExpressions(expressionA, expressionB);
}

function compareOperatorExpressions(
  expressionA: OperatorExpression,
  expressionB: OperatorExpression,
) {
  return (
    compareExpressions(expressionA.left, expressionB.left) &&
    compareExpressions(expressionA.right, expressionB.right)
  );
}
