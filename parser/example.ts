import { expressioner } from "../lib";
import { Expression } from "../lib/expressions/expression";
import { parse, Parser } from "./parser";

function variableRule(parser: Parser) {
  const name = parser.regex(/a-zA-Z0-9_/);

  return expressioner.variable(name);
}

const kkkk: Expression = parse(variableRule, "x");
