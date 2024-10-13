import { asTextParenthesized } from "../text-helper";
import {
  EvaluationContext,
  EvaluationResult,
  Expression,
  ExpressionFactory,
} from "./expression";
import { LiteralExpression } from "./expression.literal";
import { priorities } from "./priorities";

/**
 * An expression that represents a multiplication of other expressions.
 */
export class MultiplyExpression extends Expression {
  constructor(expressionFactory: ExpressionFactory, children: Expression[]) {
    super(expressionFactory, children);
  }

  get priority(): number {
    return priorities.multiply;
  }

  evaluate(context: EvaluationContext): EvaluationResult {
    const results = this.children.map((child) => child.evaluate(context));

    const literalExpressions: LiteralExpression[] = [];
    const unresolvedExpressions: Expression[] = [];
    const errors: Error[] = [];

    for (const result of results) {
      if (result.isError) {
        errors.push(result.error);
      } else if (result.expression instanceof LiteralExpression) {
        literalExpressions.push(result.expression);
      } else {
        unresolvedExpressions.push(result.expression);
      }
    }

    if (errors[0]) {
      return EvaluationResult.forError(errors[0]);
    }

    const literalPart = literalExpressions.reduce(
      (acc, literal) => acc * literal.value,
      0,
    );

    if (unresolvedExpressions.length === 0) {
      return EvaluationResult.forExpression(
        this.expressionFactory.literal(literalPart),
      );
    }

    return EvaluationResult.forExpression(
      this.expressionFactory.add([
        this.expressionFactory.literal(literalPart),
        ...unresolvedExpressions,
      ]),
    );
  }

  toText(): string {
    return this.children
      .map((child) => asTextParenthesized(this, child))
      .join(" * ");
  }
}
