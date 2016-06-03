'use strict'

function talksAbout(node, str) {
  if (node.nodeType == document.TEXT_NODE) {
    return node.nodeValue.indexOf(str) > -1;
  }

  return Array.from(node.childNodes).some((childNode) => {
    if (talksAbout(childNode, str)) return true;
  });
}

function replaceImages() {
  let images = document.getElementsByTagName('img');
  for (let i = images.length - 1; i >= 0; i--) {
    let image = images[i];
    if (image.alt) {
      let text = document.createTextNode(image.alt);
      image.parentNode.replaceChild(text, image);
    }
  }
}

function elt(type) {
  let node = document.createElement(type);
  for (let i = 1; i < arguments.length; i++) {
    let child = arguments[i];
    if (typeof child == 'string') {
      child = document.createTextNode(child);
    }
    node.appendChild(child);
  }

  return node;
}

function highlightCode(node, keywords) {
  let textContent = node.textContent;
  node.textContent = '';

  let match;
  let pos = 0;
  while (match = keywords.exec(textContent)) {
    let before = textContent.slice(pos, match.index);
    node.appendChild(document.createTextNode(before));

    let strong = document.createElement('strong');
    strong.appendChild(document.createTextNode(match[0]));
    node.appendChild(strong);

    pos = keywords.lastIndex;
  }

  let after = textContent.slice(pos);
  node.appendChild(document.createTextNode(after));
};

let languages = {
  javascript: /\bfunction|let|return|const|while|if|else|switch|for\b/g
}

function highlightAllCodes() {
  let preElements = document.getElementsByTagName('pre');
  Array.prototype.forEach.call(preElements, (preEle) => {
    let lang = preEle.getAttribute('data-language');
    languages[lang] && highlightCode(preEle, languages[lang]);
  });
}

function time(name, action) {
  let start = Date.now();
  action();
  console.log(name + ' took ' + (Date.now() - start) + 'ms');
};


(function() {
  replaceImages();
  highlightAllCodes();
  document.getElementById("quote").appendChild(
    elt("footer", "---",
        elt("strong", "Karl Popper"),
        ", preface to the second editon of ",
        elt("em", "The Open Society and Its Enemies"),
        ", 1950"));

  // offset and client size
  let p = document.getElementById('box1');
  /*alert('offset is: ' + p.offsetWidth + ' * ' + p.offsetHeight + '\n' +
        'client is: ' + p.clientWidth + ' * ' + p.clientHeight);*/

  // getBoundingClientRect()
  console.log(document.getElementById('box1').getBoundingClientRect());

  // pageXOffset and pageYOffset
  console.log(pageXOffset + ', ' + pageYOffset);

  // verify: browser engine is not immediately re-layout
  time('navie', () => {
    let target = document.getElementById('one');
    while (target.offsetWidth < 7000) {
      target.appendChild(document.createTextNode('X'));
    }
  });

  time('clever', () => {
    let target = document.getElementById('two');
    target.appendChild(document.createTextNode('XXXXX'));
    let total = Math.ceil(7000 / (target.offsetWidth / 5));
    for (let i = 5; i < total; i++) {
      target.appendChild(document.createTextNode('X'));
    }
  });

  // animating cat
  let cat = document.querySelector('#cat');
  let angle = 0, lastTime = null;
  function animate(time) {
    if (lastTime != null) {
      angle += (time - lastTime) * 0.001;
    }
    lastTime = time;
    cat.style.top = (Math.sin(angle) * 20) + "px"; cat.style.left = (Math.cos(angle) * 200) + "px"; requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}());
