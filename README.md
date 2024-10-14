# Equations resolver and drawer

Expression:

- draw(DrawContext): DrawResult
- evaluate(EvaluationContext): EvaluationResult

DrawContext:

- target: DrawTarget
- currentOrigin: x,y
- currentFontSize
- variables: [Variable]?

DrawTarget:
// Object representing the Canvas, SVG, or whatever technology used for drawing.
// Could also be a Latex string, for example, and the DrawResult would maybe depend on this

DrawResult:

- boundingBox: x1,y1,x2,y2

EvaluationContext:

- variables: [Variable]?

EvaluationResult:

- value: number? //
- error: Error? // División by 0, or other kind of errors
- reducedExpression: Expression? // If there are unresolved variables, a new expression is created

Variable:

- name
- value
- color: Color? // Optional, for drawing

## TO-DO

- Move logic to Evaluators.
- Subclass add, multiply, and other operators with OperatorExpression. Only they should have the priority logic.
- ExpressionFactory -> Remove from expressions, move to evaluators as a param
