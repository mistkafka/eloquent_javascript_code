import { Express } from "./types";
import { specialForms } from "./EggSpecialForms";

export function evaluate(express: Express, env: any) {
    switch (express.type) {
        case "value":
            return express.value;
        case "word":
            return env[express.name];
        case "apply":
            const isSpecialForm = express.operator.name in specialForms;
            if (isSpecialForm) {
                const specialForm = specialForms[express.operator.name];
                return specialForm(express.args, env);
            } else {
                const operatorFn = evaluate(express.operator, env);
                const args = express.args.map(exp => evaluate(exp, env));
                return operatorFn.apply(null, args);
            }
    }
}
