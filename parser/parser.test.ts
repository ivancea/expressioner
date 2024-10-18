import { parse, ParserError } from "./parser";

describe("Parser", () => {
  describe("string", () => {
    it("should match a string", () => {
      expect(parse((parser) => parser.string("x"), "x")).toBe("x");
    });

    it("should match multiple contiguous strings", () => {
      expect(
        parse((parser) => {
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
        parse((parser) => {
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
      expect(() => {
        parse((parser) => {
          return parser.string("x");
        }, "a");
      }).toThrow(new ParserError(`Expected "x" at index 0`));
    });

    it("shouldn't throw if it doesn't match after multiple matchers", () => {
      expect(() => {
        parse((parser) => {
          parser.string("a");
          parser.string("b");
          parser.string("c");
          parser.string("d");
          parser.string("e");
        }, "abcd-");
      }).toThrow(new ParserError(`Expected "e" at index 4`));
    });
  });

  describe("regex", () => {
    it("should match a string", () => {
      expect(parse((parser) => parser.regex(/x/), "x")).toBe("x");
    });

    it("should match multiple contiguous strings", () => {
      expect(
        parse((parser) => {
          return [parser.regex(/x/), parser.regex(/y/), parser.regex(/z/)].join(
            "",
          );
        }, "xyz"),
      ).toBe("xyz");
    });

    it("should match multiple wildcarded regexes", () => {
      expect(
        parse((parser) => {
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
      expect(() => {
        parse((parser) => {
          return parser.regex(/x/);
        }, "axx");
      }).toThrow(
        new ParserError(`Expected a string matching "/x/" at index 0`),
      );
    });

    it("shouldn't throw if it doesn't match after multiple matchers", () => {
      expect(() => {
        parse((parser) => {
          parser.regex(/a/);
          parser.regex(/b/);
          parser.regex(/c/);
          parser.regex(/d/);
          parser.regex(/e/);
        }, "abcd-e");
      }).toThrow(
        new ParserError(`Expected a string matching "/e/" at index 4`),
      );
    });
  });
});
