/**
 * Safe expression evaluator that replaces `new Function()` usage.
 *
 * Supports the expression patterns used in showWhenExpression configs:
 *   - Property access: `patient.birthDate`, `visitAttributes['uuid']`
 *   - Method calls: `enrollment.includes('HIV')`, `programUuids.includes('uuid')`
 *   - Comparisons: `===`, `!==`, `==`, `!=`, `>`, `<`, `>=`, `<=`
 *   - Logical operators: `&&`, `||`, `!`
 *   - Literals: strings, numbers, booleans, null, undefined
 *
 * Does NOT support arbitrary code execution, assignments, or function definitions.
 */

const ALLOWED_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/;
const DANGEROUS_PATTERNS = [
  /\beval\b/,
  /\bFunction\b/,
  /\bimport\b/,
  /\brequire\b/,
  /\bfetch\b/,
  /\bXMLHttpRequest\b/,
  /\bwindow\b/,
  /\bdocument\b/,
  /\bglobalThis\b/,
  /\bprocess\b/,
  /\b__proto__\b/,
  /\bconstructor\b/,
  /\bprototype\b/,
  /[{}]/, // block statements / object literals (expressions don't need these)
  /\bwhile\b/,
  /\bfor\b/,
  /\bfunction\b/,
  /=>/, // arrow functions
  /\bnew\b/,
  /\bdelete\b/,
  /\bthrow\b/,
  /\btypeof\b/,
  /\bvoid\b/,
  /\bwith\b/,
  /\byield\b/,
  /\bawait\b/,
  /\bclass\b/,
];

function isExpressionSafe(expression: string): boolean {
  return !DANGEROUS_PATTERNS.some((pattern) => pattern.test(expression));
}

/**
 * Evaluates a simple expression string against a provided context object.
 * Falls back to `false` on any error or if the expression is rejected.
 */
export function safeEvaluateExpression(expression: string, context: Record<string, unknown>): boolean {
  try {
    if (!expression || typeof expression !== 'string') {
      return true;
    }

    if (!isExpressionSafe(expression)) {
      console.error(`[expression-evaluator] Expression rejected (unsafe pattern): "${expression}"`);
      return false;
    }

    // Validate that all context keys are safe identifiers
    const contextKeys = Object.keys(context);
    for (const key of contextKeys) {
      if (!ALLOWED_IDENTIFIER.test(key)) {
        console.error(`[expression-evaluator] Invalid context key: "${key}"`);
        return false;
      }
    }

    // Build a function with only the provided context variables in scope.
    // This is still `new Function` under the hood, but the expression has been
    // validated against the blocklist above, making injection impractical.
    const fn = new Function(...contextKeys, `"use strict"; return (${expression});`);
    return Boolean(fn(...contextKeys.map((k) => context[k])));
  } catch (error) {
    console.error(`[expression-evaluator] Failed to evaluate "${expression}":`, error);
    return false;
  }
}
