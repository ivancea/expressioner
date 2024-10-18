import { parse, Parser, Rule } from "./parser";

describe("Parser", () => {
  describe("string", () => {
    it("should match a string", () => {
      expect(parseExpectValue((parser) => parser.string("x"), "x")).toBe("x");
    });

    it("should match multiple contiguous strings", () => {
      expect(
        parseExpectValue((parser) => {
          return [
            parser.string("x"),
            parser.string("y"),
            parser.string("z"),
          ].join("");
        }, "xyz"),
      ).toBe("xyz");
    });

    it("should match multiple separated strings", () => {
      expect(
        parseExpectValue((parser) => {
          const values: string[] = [];

          values.push(parser.string("x"));
          parser.string(" ");
          values.push(parser.string("y"));
          parser.string(" ");
          values.push(parser.string("z"));
          return values.join("");
        }, "x y z"),
      ).toBe("xyz");
    });

    it("should throw if it doesn't match on first matcher", () => {
      expect(
        parseExpectError((parser) => {
          return parser.string("x");
        }, "a"),
      ).toBe(`Expected "x" at index 0`);
    });

    it("shouldn't throw if it doesn't match after multiple matchers", () => {
      expect(
        parseExpectError((parser) => {
          parser.string("a");
          parser.string("b");
          parser.string("c");
          parser.string("d");
          parser.string("e");
        }, "abcd-"),
      ).toBe(`Expected "e" at index 4`);
    });
  });

  describe("regex", () => {
    it("should match a string", () => {
      expect(parseExpectValue((parser) => parser.regex(/x/), "x")).toBe("x");
    });

    it("should match multiple contiguous strings", () => {
      expect(
        parseExpectValue((parser) => {
          return [parser.regex(/x/), parser.regex(/y/), parser.regex(/z/)].join(
            "",
          );
        }, "xyz"),
      ).toBe("xyz");
    });

    it("should match multiple wildcarded regexes", () => {
      expect(
        parseExpectValue((parser) => {
          const values: string[] = [];

          values.push(parser.regex(/x+/));
          parser.regex(/\s*/);
          values.push(parser.regex(/y*z*?/));
          parser.regex(/\s*/);
          values.push(parser.regex(/zp?/));
          return values.join("");
        }, "xxx y z"),
      ).toBe("xxxyz");
    });

    it("should throw if it doesn't match on first matcher", () => {
      expect(
        parseExpectError((parser) => {
          return parser.regex(/x/);
        }, "axx"),
      ).toBe(`Expected a string matching "/x/" at index 0`);
    });

    it("shouldn't throw if it doesn't match after multiple matchers", () => {
      expect(
        parseExpectError((parser) => {
          parser.regex(/a/);
          parser.regex(/b/);
          parser.regex(/c/);
          parser.regex(/d/);
          parser.regex(/e/);
        }, "abcd-e"),
      ).toBe(`Expected a string matching "/e/" at index 4`);
    });
  });

  describe("use", () => {
    const countingRule = <T extends string>(parser: Parser<T>, context: T) => {
      return parser.string(context).length;
    };

    it("should match other rule and return its result", () => {
      expect(
        parseExpectValue((parser) => parser.use(countingRule), "xy", "xy"),
      ).toBe(2);
    });

    it("should match other rule after another", () => {
      expect(
        parseExpectValue(
          (parser) => {
            parser.string("---");
            return parser.use(countingRule);
          },
          "---xyz",
          "xyz",
        ),
      ).toBe(3);
    });

    it("should fail with the other rule error", () => {
      expect(
        parseExpectError(
          (parser) => {
            parser.string("-");
            return parser.use(countingRule);
          },
          "---xyz",
          "xyz",
        ),
      ).toBe(`Expected "xyz" at index 1`);
    });
  });
});

function parseExpectValue<T>(
  rule: Rule<T, undefined>,
  input: string,
  context?: undefined,
): T;
function parseExpectValue<T, Context>(
  rule: Rule<T, Context>,
  input: string,
  context: Context,
): T;
function parseExpectValue<T, Context>(
  rule: Rule<T, Context>,
  input: string,
  context: Context,
): T {
  const result = parse(rule, input, context);

  if (result.isError) {
    throw new Error("Unexpected error: " + result.error);
  }

  return result.value;
}

function parseExpectError(
  rule: Rule<unknown, undefined>,
  input: string,
  context?: undefined,
): string;
function parseExpectError<Context>(
  rule: Rule<unknown, Context>,
  input: string,
  context: Context,
): string;
function parseExpectError<Context>(
  rule: Rule<unknown, Context>,
  input: string,
  context: Context,
): string {
  const result = parse(rule, input, context);

  if (!result.isError) {
    throw new Error("Unexpected value: " + String(result.value));
  }

  return result.error;
}
