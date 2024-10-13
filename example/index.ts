import { expressioner } from "../lib";

function main() {
  const expression = expressioner.literal(5).multiply(
    expressioner
      .literal(7)
      .add(expressioner.literal(3))
      .add(expressioner.literal(2).multiply(expressioner.literal(23))),
  );

  document.body.innerHTML = `
    <h1>Expression</h1>
    <pre>${expressioner.toText(expression)} = ${expressioner.toNumber(expression)}</pre>
  `;
}

window.addEventListener("DOMContentLoaded", main);
