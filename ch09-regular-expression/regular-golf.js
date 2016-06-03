const exercises = [
  {str: 'car and cat', reg:/\bca[rt]\b/g },
  {str: 'pop and prop', reg:/\bp(r?)op\b/g},
  {str: 'ferret, ferry, and ferrari', reg:/\bferr(et|y|ari)\b/g},
  {str: 'waious, dkfious, asdfious and aidfious', reg:/\b\w+ious\b/g},
  {str: ' , and  . and  ; and  :', reg:/\s(,|\.|;|:)/g},
  {str: 'abcde and abcdef and abcdefg', reg:/\b\w{6}\w*\b/g},
  {str: 'abcde aned ABC and heaha', reg:/\b[a-df-z]+\b/ig}
];

exercises.forEach((ex) => {
  console.log(ex.str + ' --- ' + ex.str.replace(ex.reg, 'hint'));
});
