function getElementsByTagName(node, tagName) {
  tagName = tagName.toLowerCase();
  let elements = [];
  function find(node) {
    if (node.tagName == null) {
      return;
    }
    if (node.tagName.toLowerCase() == tagName) {
      elements.push(node);
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      find(node.childNodes[i]);
    }
  }
  find(node);

  return elements;
}

(function(){
  let myRoot = document.getElementById('myRoot');
  console.log(getElementsByTagName(myRoot, 'div'));
}());
