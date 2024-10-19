import { isNil } from "lodash-es";
import { Parser } from "./parser.types";

/*
Example language to test the parser
*/

export const EXAMPLE_UNIT_INPUT = `
class A {
  prop x: number;
  prop y: string;
}
class B {}
`;

export const EXAMPLE_CLASS_INPUT = `
class A {
  prop x: number;
  prop y: string;
}
`.trim();

export const EXAMPLE_PROPERTY_INPUT = `
prop x: number;
`.trim();

// AST

type UnitAST = {
  astType: "unit";
  classes: ClassAST[];
};

type ClassAST = {
  astType: "class";
  name: string;
  properties: PropertyAST[];
};

type PropertyAST = {
  astType: "property";
  name: string;
  type: string;
};

export function unitRule(parser: Parser): UnitAST {
  const classes: ClassAST[] = [];

  for (let i = 0; i < 10000; i++) {
    parser.regex(/\s*/);
    const classAst = parser.any(classRule, () => undefined);

    if (isNil(classAst)) {
      break;
    }

    classes.push(classAst);
  }

  // Consume everything until EOF
  parser.regex(/\s*/);

  return {
    astType: "unit",
    classes,
  };
}

export function classRule(parser: Parser): ClassAST {
  parser.string("class");
  parser.regex(/\s*/);
  const name = parser.regex(/[a-zA-Z0-9_]+/);

  parser.regex(/\s*/);
  parser.string("{");
  parser.regex(/\s*/);

  const properties: PropertyAST[] = [];

  for (let i = 0; i < 1_000; i++) {
    parser.regex(/\s*/);
    const propertyAst = parser.any(propertyRule, () => undefined);

    if (isNil(propertyAst)) {
      break;
    }

    properties.push(propertyAst);
  }

  parser.regex(/\s*/);
  parser.string("}");

  return {
    astType: "class",
    name,
    properties,
  };
}

export function propertyRule(parser: Parser): PropertyAST {
  parser.string("prop");
  parser.regex(/\s*/);
  const name = parser.regex(/[a-zA-Z0-9_]+/);
  parser.regex(/\s*/);
  parser.string(":");
  parser.regex(/\s*/);
  const type = parser.regex(/[a-zA-Z0-9_]+/);
  parser.regex(/\s*/);
  parser.string(";");

  return {
    astType: "property",
    name,
    type,
  };
}

function otherRule(parser: Parser) {
  const value = parser.string("abc");

  return {
    value,
  };
}
