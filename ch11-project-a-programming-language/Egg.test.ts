import { run } from "./Egg";
run('do(define(total, 0), ',
    '   define(count, 1), ',
    '   while(<(count, 11),',
    '         do(define(total, +(total, count)),',
    '            define(count, +(count, 1)))),',
    '   print(total))'
);
