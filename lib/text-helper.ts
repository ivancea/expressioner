import { Expression } from "./expressions/expression";

export function asTextParenthesized(
  parent: Expression,
  child: Expression,
): string {
  const childText = child.toText();

  if (parent.priority < child.priority && child.children.length > 1) {
    return `(${childText})`;
  }

  return childText;
}
