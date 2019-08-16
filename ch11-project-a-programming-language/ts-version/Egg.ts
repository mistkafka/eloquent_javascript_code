import { parse } from "./EggParser";
import { topEnv } from "./EggEnv";
import { evaluate } from "./EggEval";

function run(...lines: string[]) {
    const env = Object.create(topEnv);
    const program = lines.join('\n');
    return evaluate(parse(program), env);
}

export {
    run
}
