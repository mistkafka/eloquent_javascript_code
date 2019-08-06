export interface ValueExpress {
    type: 'value';
    tokenLength: number;
    value: string | number;
}

export interface WordExpress {
    type: 'word';
    tokenLength: number;
    name: string
}

export interface ApplyExpress {
    type: 'apply',
    operator: WordExpress,
    args: Express[]
}

export type Express = ValueExpress | WordExpress | ApplyExpress;

export interface ASTNode {
    expr: Express;
    restProgram: string;
}
