import { expressioner } from "../lib";
import { Expression } from "../lib/expressions/expression";
import { parse, Parser, ParserResult } from "./parser";

function otherRule(parser: Parser) {
  const value = parser.string("abc");

  return {
    value,
  };
}

function variableRule(parser: Parser) {
  const name = parser.regex(/a-zA-Z0-9_/);
  const space: { value: "abc" } = parser.use(otherRule);

  const something: "a" | "b" | "c" = parser.any(
    (p) => p.string("a"),
    (p) => p.string("b"),
    (p) => p.string("c"),
  );

  return expressioner.variable(name);
}

const kkkk: ParserResult<Expression> = parse(variableRule, "x");
