/**
 * The base class of all expressions.
 *
 * To compose expressions, use the available methods here.
 */
export abstract class Expression {
  constructor(
    protected readonly expressionFactory: ExpressionFactory,
    public readonly children: Expression[],
  ) {}

  /**
   * Returns the priority of the expression. A smaller number means higher priority.
   */
  abstract get priority(): number;

  /**
   * Evaluates the expression, and returns a result.
   *
   * This is an internal method, use the `expressioner` methods instead.
   */
  abstract evaluate(context: EvaluationContext): EvaluationResult;

  /**
   * Converts the expression to a raw text.
   */
  abstract toText(): string;

  draw(): void {
    throw new Error("Draw not supported yet");
  }

  add(expression: Expression): Expression {
    return this.expressionFactory.add([this, expression]);
  }

  multiply(expression: Expression): Expression {
    return this.expressionFactory.multiply([this, expression]);
  }
}

export type ExpressionFactory = {
  literal(value: number): Expression;
  add(expressions: Expression[]): Expression;
  multiply(expressions: Expression[]): Expression;
};

export class EvaluationContext {}

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
