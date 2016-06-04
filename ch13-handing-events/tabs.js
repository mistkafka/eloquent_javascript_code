function asTab(node) {
  let tabs = Array.from(node.childNodes)
        .filter((node) => node.nodeType == Node.ELEMENT_NODE);
  let buttonList = document.createElement('div');

  tabs.forEach((tab) => {
    let button = document.createElement('button');
    button.appendChild(document.createTextNode(tab.getAttribute('data-tabname')));

    button.addEventListener('click', (event) => {
      // set color
      Array.from(buttonList.childNodes).forEach((button) => {
        button.style.backgroundColor = 'white';
      });
      event.target.style.backgroundColor = 'orange';

      // show tab
      hideAll(tabs);
      tab.style.display = 'block';
    });
    buttonList.appendChild(button);
  });
  node.insertBefore(buttonList, node.firstChild);
}

function hideAll(tabs) {
  tabs.forEach((tab) => {
    tab.style.display = 'none';
  });
}

(function(){
  let tabs = document.getElementById('wrapper');
  asTab(tabs);
}());
