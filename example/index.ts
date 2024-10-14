import { expressioner } from "../lib";
import { Expression } from "../lib/expressions/expression";

function main() {
  try {
    document.body.innerHTML =
      renderExpression(
        expressioner.literal(5).multiply(
          expressioner
            .literal(7)
            .add(expressioner.literal(3))
            .add(expressioner.literal(2).multiply(expressioner.literal(23))),
        ),
      ) +
      renderExpression(
        expressioner
          .literal(5)
          .divide(expressioner.literal(7).divide(expressioner.literal(3))),
      ) +
      renderExpression(
        expressioner
          .literal(5)
          .divide(expressioner.literal(7))
          .divide(expressioner.literal(3)),
      ) +
      renderExpression(
        expressioner
          .literal(10)
          .add(expressioner.literal(8))
          .subtract(expressioner.literal(10).add(expressioner.literal(9))),
      ) +
      renderExpression(
        expressioner
          .literal(10)
          .subtract(expressioner.literal(8))
          .add(expressioner.literal(10).subtract(expressioner.literal(9))),
      ) +
      renderExpression(
        expressioner
          .literal(10)
          .subtract(
            expressioner
              .literal(8)
              .add(expressioner.literal(10).subtract(expressioner.literal(9))),
          ),
      ) +
      renderExpression(
        expressioner
          .literal(3)
          .multiply(expressioner.variable("x"))
          .subtract(expressioner.variable("y")),
        { x: 5, y: 15 },
      );
  } catch (error) {
    document.body.innerHTML = `<h1>Error</h1><pre>${String(error)}</pre>`;
  }
}

function renderExpression(
  expression: Expression,
  variables: Record<string, number> = {},
) {
  return `
    <h1>Expression</h1>
    <pre>${expressioner.toText(expression)} = ${expressioner.toNumber(expression, variables)}</pre>
    ${renderVariables(variables)}
  `;
}

function renderVariables(variables: Record<string, number>) {
  if (Object.keys(variables).length === 0) {
    return "";
  }

  return `
    <h4>For:</h4>
    <pre>${Object.keys(variables)
      .map((name) => `${name} = ${variables[name]}`)
      .join("\n")}</pre>
  `;
}

window.addEventListener("DOMContentLoaded", main);
