// Parser

export type Parser = {
  regex: (regex: RegExp) => string;
  string: (value: string) => string;
};

export type Rule<T> = (parser: Parser) => T;

class MatcherError extends Error {}
export class ParserError extends Error {}

export function parse<RuleReturnType>(
  rule: Rule<RuleReturnType>,
  input: string,
  initialInputIndex = 0,
  maxIterationsPerRule = 1_000,
): RuleReturnType {
  const state: StateElement[] = [];

  for (let i = 0; i < maxIterationsPerRule; i++) {
    const currentInputIndex = () =>
      state[state.length - 1]?.lastInputIndex ?? initialInputIndex;
    let currentStateIndex = 0;

    try {
      return rule({
        regex: (regex: RegExp) => {
          // TODO: Handle changing rule matchers
          if (state[currentStateIndex]) {
            return state[currentStateIndex++]?.value as string;
          }

          const fixedRegex = new RegExp(`${regex.source}`, "y");
          fixedRegex.lastIndex = currentInputIndex();
          const match = fixedRegex.exec(input);

          if (!match) {
            throw new MatcherError(
              `Expected a string matching "${regex}" at index ${currentInputIndex()}`,
            );
          }

          const value = match[0];

          state.push({
            type: "value",
            initialInputIndex: currentInputIndex(),
            lastInputIndex: currentInputIndex() + value.length,
            value,
          });
          currentStateIndex++;

          return value;
        },

        string: (value: string) => {
          if (state[currentStateIndex]) {
            return state[currentStateIndex++]?.value as string;
          }

          if (!input.startsWith(value, currentInputIndex())) {
            throw new MatcherError(
              `Expected "${value}" at index ${currentInputIndex()}`,
            );
          }

          state.push({
            type: "value",
            initialInputIndex: currentInputIndex(),
            lastInputIndex: currentInputIndex() + value.length,
            value,
          });
          currentStateIndex++;

          return value;
        },
      });
    } catch (error) {
      if (!(error instanceof MatcherError)) {
        throw error;
      }

      for (let j = state.length - 1; j >= 0; j--) {
        const stateElement = state[j];

        if (stateElement?.type === "value") {
          state.pop();
        }
      }

      if (state.length === 0) {
        throw new ParserError(error.message);
      }
    }
  }

  throw new ParserError("Max iterations reached");
}

type StateElement = ValueStateElement;

type StateElementBase = {
  type: string;

  initialInputIndex: number;
  lastInputIndex: number;

  value: unknown;
};

/**
 * State element representing a match without extra state.
 */
type ValueStateElement = StateElementBase & {
  type: "value";
};
