module.exports = grammar({
  name: 'nytrogen',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    // The entry point of the language
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.function_definition,
      $.struct_definition,
      $.enum_definition,
      $.const_definition
    ),

    // Functions: int name(params) { body }
    function_definition: $ => seq(
      $.type,
      $.identifier,
      $.parameter_list,
      $.block
    ),

    parameter_list: $ => seq('(', sepBy(',', $.parameter), ')'),
    parameter: $ => seq($.type, $.identifier),

    // Structs and Enums
    struct_definition: $ => seq('struct', $.identifier, '{', repeat($.member_declaration), '}'),
    member_declaration: $ => seq($.type, $.identifier, ';'),

    enum_definition: $ => seq('enum', $.identifier, '{', sepBy(',', $.identifier), '}'),

    const_definition: $ => seq('const', $.type, $.identifier, '=', $._expression, ';'),

    // Types
    type: $ => choice('int', 'float', 'string', 'bool', 'void', 'char', $.identifier),

    // Block and Statements
    block: $ => seq('{', repeat($._statement), '}'),

    _statement: $ => choice(
      $.return_statement,
      $.if_statement,
      $.while_statement,
      $.print_statement,
      $.expression_statement,
      $.variable_declaration
    ),

    variable_declaration: $ => seq($.type, $.identifier, optional(seq('=', $._expression)), ';'),
    return_statement: $ => seq('return', optional($._expression), ';'),
    print_statement: $ => seq('print', $._expression, ';'),
    
    if_statement: $ => seq(
      'if', '(', $._expression, ')',
      $.block,
      optional(seq('else', $.block))
    ),

    while_statement: $ => seq('while', '(', $._expression, ')', $.block),
    expression_statement: $ => seq($._expression, ';'),

    // Expressions (Simplified for now)
    _expression: $ => choice(
      $.identifier,
      $.number,
      $.string,
      $.binary_expression,
      $.call_expression,
      $.index_expression,
      $.member_expression
    ),

    binary_expression: $ => prec.left(1, seq($._expression, choice('+', '-', '*', '/', '==', '>', '<'), $._expression)),
    call_expression: $ => seq($.identifier, '(', sepBy(',', $._expression), ')'),
    index_expression: $ => seq($._expression, '[', $._expression, ']'),
    member_expression: $ => seq($._expression, '.', $.identifier),

    // Literals and Identifiers
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: $ => /\d+(\.\d+)?f?/,
    string: $ => /"[^"]*"/,
    comment: $ => token(seq('//', /.*/))
  }
});

// Helper function for comma-separated lists
function sepBy(sep, rule) {
  return optional(seq(rule, repeat(seq(sep, rule))));
}
