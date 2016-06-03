function singleQuote2Double(str) {
  let reg = /\W'(.*)'\W/g;

  let strCoved = str.replace(reg, function(match, gp1Content) {
    return match[0] + '\"' + gp1Content + '\"' + match[match.length - 1];
  });

  return strCoved;
}

function doublequote2Single(str) {
  let reg = /\W"(.*)"\W/g;

  let strCoved = str.replace(reg, function(match, gp1Content) {
    return match[0] + '\'' + gp1Content + '\'' + match[match.length - 1];
  });

  return strCoved;
}

let doubleQuoteStr = 'he said: \"how are you? I\'m fine, thanks. I\'m very happy boxes\'\".  you\'r welcome. I\'m very happy.';
let singleQuoteStr = doublequote2Single(doubleQuoteStr);

console.log(singleQuote2Double(singleQuoteStr));


// example code. cool!
let text = "'I'm the cook,' he said, 'it's my job.'";

console.log(text.replace(/(^|\W)'|'($\W)/g, '$1"$2'));
