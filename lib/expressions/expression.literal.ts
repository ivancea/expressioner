import {
  EvaluationContext,
  EvaluationResult,
  Expression,
  ExpressionFactory,
} from "./expression";
import { priorities } from "./priorities";

/**
 * An expression that represents a literal number.
 *
 * Leaf node of the expression tree, and also the simplest result of an evaluation.
 */
export class LiteralExpression extends Expression {
  constructor(
    expressionFactory: ExpressionFactory,
    public readonly value: number,
  ) {
    super(expressionFactory, []);
  }

  get priority(): number {
    return priorities.literal;
  }

  evaluate(context: EvaluationContext): EvaluationResult {
    return EvaluationResult.forExpression(this);
  }

  toText(): string {
    return this.value.toString();
  }
}
