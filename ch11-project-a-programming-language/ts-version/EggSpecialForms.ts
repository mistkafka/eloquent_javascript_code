/**
 * special forms
 * 一般需要操作env
 * 一般需要在调用的时候时候，需要自己控制何时evaluate express。反观普通的"调用"，在调用前就把参数evaluate express。
 */

import {evaluate} from "./EggEval";
import {Express, WordExpress} from "./types";

const specialForms = {

    /**
     *
     * @param args: (cond-exp true-exp false-exp)
     * @param env
     */
    if (args: Express[], env: any) {
        if (args.length !== 3) {
            throw new SyntaxError('Bad arguments number for "if"');
        }

        if (evaluate(args[0], env) !== false) {
            return evaluate(args[1], env);
        } else {
            return evaluate(args[2], env);
        }
    },

    /**
     *
     * @param args: (cond-exp body)
     * @param env
     */
    while(args: Express[], env: any) {
        if (args.length !== 2) {
            throw new SyntaxError('Bad arguments number for "while"');
        }

        while(evaluate(args[0], env) !== false) {
            evaluate(args[1], env);
        }
    },

    /**
     * evaluate a list of express, and return the value of latest express
     * @param args
     * @param env
     */
    do(args: Express[], env: any) {
        let val = false;

        args.forEach(item => {
            val = evaluate(item, env);
        });

        return val;
    },

    /**
     * define and initial a variable
     * @param args
     * @param env
     */
    define([variableExpress, valueExpress]: [WordExpress, Express], env: any) {
        if (variableExpress === undefined || valueExpress === undefined) {
            throw new SyntaxError('Bad arguments number for "define"');
        }
        if (variableExpress.type !== 'word') {
            throw new SyntaxError('Can only "define" a variable with word');
        }

        const word = variableExpress.name;
        const value = evaluate(valueExpress, env);
        env[word] = value;

        return value;
    },

    assign([variableExpress, valueExpress]: [WordExpress, Express], env: any) {
        if (variableExpress === undefined || valueExpress === undefined) {
            throw new SyntaxError('Bad arguments number for "assign"');
        }
        if (variableExpress.type !== 'word') {
            throw new SyntaxError('Can only "assign" value to a variable');
        }
        const variableName = variableExpress.name;
        if (!(variableName in env)) {
            throw new ReferenceError(`${variableName} is undefined`);
        }

        const value = evaluate(valueExpress, env);

        // find the correct env where the variable defined
        let originEnv = env;
        while(!originEnv.hasOwnProperty(variableName)) {
            originEnv = Object.getPrototypeOf(originEnv);
        }

        originEnv[variableName] = value;

        return value;
    },

    fun(argv: Express[], env: any) {
        const argvLength = argv.length;
        if (argvLength < 1) {
            throw new SyntaxError('Bad arguments for "function"');
        }
        const argExpresses = argv.slice(0, argvLength - 1) as WordExpress[];
        const bodyExpress = argv[argvLength - 1];

        return function (...args) {
            if (args.length !== argExpresses.length) {
                throw new SyntaxError('wrong number of arguments for function')
            }
            const localEnv = Object.create(env);
            argExpresses.forEach((argExpress, index) => {
                const argValue = args[index];
                const argName = argExpress.name;
                localEnv[argName] = argValue;
            });
            return evaluate(bodyExpress, localEnv);
        }
    }
};

export {
    specialForms
}
