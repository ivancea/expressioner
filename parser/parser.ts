// Parser

export type Parser<Context = undefined> = {
  regex: (regex: RegExp) => string;
  string: <S extends string>(value: S) => S;
  use: <T>(rule: Rule<T, Context>) => T;
  any: <R>(...rules: [Rule<R, Context>, ...Rule<R, Context>[]]) => R;
  many: <R>(
    rule: Rule<R, Context>,
    min: number,
    max: number,
    greedy: boolean,
  ) => R[];
};

export type Rule<T, Context> = (parser: Parser<Context>, context: Context) => T;

export type ParserResult<T> =
  | {
      isError: false;
      value: T;
      lastInputIndex: number;
    }
  | {
      isError: true;
      error: string;
    };

class MatcherError extends Error {}

export function parse<T>(
  rule: Rule<T, undefined>,
  input: string,
  context?: never,
): ParserResult<T>;
export function parse<T, Context>(
  rule: Rule<T, Context>,
  input: string,
  context: Context,
  initialInputIndex?: number,
  partial?: boolean,
  maxIterationsPerRule?: number,
): ParserResult<T>;
export function parse<T, Context>(
  rule: Rule<T, Context>,
  input: string,
  context: Context,
  initialInputIndex = 0,
  partial = false,
  maxIterationsPerRule = 1_000,
): ParserResult<T> {
  const state: StateElement[] = [];

  for (let i = 0; i < maxIterationsPerRule; i++) {
    const currentInputIndex = (ignoreLast = false) =>
      state[state.length - (ignoreLast ? 2 : 1)]?.lastInputIndex ??
      initialInputIndex;
    let currentStateIndex = 0;

    try {
      const result = rule(
        {
          string: <S extends string>(value: S): S => {
            // TODO: Handle changing rule matchers
            if (state[currentStateIndex]?.value === value) {
              return state[currentStateIndex++]?.value as S;
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

          regex: (regex: RegExp) => {
            if (state[currentStateIndex]) {
              return state[currentStateIndex++]?.value as string;
            }

            const fixedRegex = new RegExp(regex, "y");
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

          use: <T>(rule: Rule<T, Context>): T => {
            if (state[currentStateIndex]) {
              return state[currentStateIndex++]?.value as T;
            }

            const ruleResult = parse(
              rule,
              input,
              context,
              currentInputIndex(),
              true,
              maxIterationsPerRule,
            );

            if (ruleResult.isError) {
              throw new MatcherError(ruleResult.error);
            }

            state.push({
              type: "value",
              initialInputIndex: currentInputIndex(),
              lastInputIndex: ruleResult.lastInputIndex,
              value: ruleResult.value,
            });
            currentStateIndex++;

            return ruleResult.value;
          },

          any: <R>(...rules: [Rule<R, Context>, ...Rule<R, Context>[]]): R => {
            const rawCurrentState = state[currentStateIndex];
            const currentState =
              rawCurrentState?.type === "any" ? rawCurrentState : undefined;

            if (currentState && currentState.valid) {
              currentStateIndex++;
              return currentState.value as R;
            }

            const nextRuleIndex = currentState
              ? currentState.currentRuleIndex + 1
              : 0;

            for (let j = nextRuleIndex; j < rules.length; j++) {
              const rule = rules[j];
              if (!rule) {
                continue;
              }

              const ruleResult = parse(
                rule,
                input,
                context,
                currentInputIndex(!!currentState),
                true,
                maxIterationsPerRule,
              );

              if (!ruleResult.isError) {
                if (currentState) {
                  state.pop();
                }
                state.push({
                  type: "any",
                  initialInputIndex: currentInputIndex(!!currentState),
                  lastInputIndex: ruleResult.lastInputIndex,
                  value: ruleResult.value,
                  currentRuleIndex: j,
                  valid: true,
                });
                currentStateIndex++;

                return ruleResult.value;
              }
            }

            throw new MatcherError(
              `Expected any of the rules at index ${currentInputIndex()}`,
            );
          },
          many: <R>(
            rule: Rule<R, Context>,
            min: number,
            max: number,
            greedy: boolean,
          ): R[] => {
            return [];
          },
        },
        context,
      );

      if (!partial && currentInputIndex() < input.length) {
        throw new MatcherError(
          `Expected end of input at index ${currentInputIndex()}`,
        );
      }

      return {
        isError: false,
        value: result,
        lastInputIndex: currentInputIndex(),
      };
    } catch (error) {
      if (!(error instanceof MatcherError)) {
        throw error;
      }

      for (let j = state.length - 1; j >= 0; j--) {
        const stateElement = state[j];

        if (stateElement?.type === "value") {
          state.pop();
          continue;
        }
        if (stateElement?.type === "any") {
          if (stateElement.valid) {
            stateElement.valid = false;
            break;
          }
          state.pop();
          continue;
        }

        throw new Error("Invalid state element type");
      }

      if (state.length === 0) {
        return {
          isError: true,
          error: error.message,
        };
      }
    }
  }

  return {
    isError: true,
    error: "Max iterations reached",
  };
}

type StateElement = ValueStateElement | AnyStateElement | ManyStateElement;

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

type AnyStateElement = StateElementBase & {
  type: "any";

  /**
   * The index of the rule from the any() rules array that worked.
   */
  currentRuleIndex: number;
  /**
   * Temporary value to let a rule be invalidated.
   *
   * If false, it will be discarded on the next iteration.
   */
  valid: boolean;
};

type ManyStateElement = StateElementBase & {
  type: "many";

  matches: unknown[];
  lastMatchIndexes: number[];

  failedAttempts: number;
};
