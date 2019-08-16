import {
    ASTNode,
    Express,
    ValueExpress,
    WordExpress,
    ApplyExpress
} from "./types";


const REG_EXP = {
    VALUE_STRING: /^"([^"])"/,
    VALUE_NUMBER: /^\d+/,
    WORD: /^[^\s(),"]+/
};


export function parse(program: string): Express {
    const ast = parseExpression(program);
    if (skipSpace(ast.restProgram).length > 0) {
        throw new SyntaxError('Undepected text after program');
    }

    return ast.expr;
}

function parseApply(expr: Express, program): ASTNode {
    program = skipSpace(program);
    if (program[0] !== '(') {
        return {
            expr,
            restProgram: program
        }
    } else {
        // (exp1 exp2 exp3)
    }

    if (expr.type !== 'word') {
        throw new SyntaxError('only word express can be apply name');
    }
    program = skipSpace(program.slice(1));
    const applyExpr: ApplyExpress = {
        type: 'apply',
        operator: expr,
        args: []
    };
    while (program[0] !== ')') {
        const argNode = parseExpression(program);
        applyExpr.args.push(argNode.expr);
        program = skipSpace(argNode.restProgram);

        if (program[0] === ',') {
            program = skipSpace(program.slice(1));
        } else if (program[0] !== ')') {
            debugger;
            throw new SyntaxError('Expected \',\' or \')\'');
        }
    }
    program = program.slice(1);
    return parseApply(applyExpr, program);
}

function parseExpression(program: string): ASTNode {
    program = skipSpace(program);
    const expr = [
        parseNextValueStringExpression,
        parseNextValueNumberExpression,
        parseNextWordExpression
    ].reduce((expr: ValueExpress | WordExpress | null, fn) => {
        if (expr) {
            return expr;
        }
        expr = fn(program);
        return expr;
    }, null);

    if (expr === null) {
        throw new SyntaxError('Unexpected syntax:' + program);
    }

    return parseApply(expr, program.slice(expr.tokenLength));
}

function parseNextValueStringExpression(program: string): ValueExpress | null {
    const match = REG_EXP.VALUE_STRING.exec(program);
    if (!match) {
        return null;
    }

    const type = 'value';
    const value = match[1];
    const tokenLength = match[0].length;

    return {
        type,
        value,
        tokenLength
    }
}

function parseNextValueNumberExpression(program: string): ValueExpress | null {
    const match = REG_EXP.VALUE_NUMBER.exec(program);
    if (!match) {
        return null;
    }

    const type = 'value';
    const value = Number.parseInt(match[0], 10);
    const tokenLength = match[0].length;

    return {
        type,
        value,
        tokenLength
    }
}

function parseNextWordExpression(program: string): WordExpress | null {
    const match = REG_EXP.WORD.exec(program);
    if (!match) {
        return null;
    }

    const type = 'word';
    const name = match[0];
    const tokenLength = match[0].length;

    return {
        type,
        name,
        tokenLength
    }
}


function skipSpace(str: string): string {
    return str.replace(/^\s*/, '');
}
