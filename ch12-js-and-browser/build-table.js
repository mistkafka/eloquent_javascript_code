function buildTable(data) {
  let keys = Object.keys(data[0]);
  let table = document.createElement('table');
  table.appendChild(buildTableHeader(keys));

  data.forEach((item) => {
    let tr = document.createElement('tr');
    keys.forEach((key) => {
      let td = document.createElement('td');
      td.appendChild(document.createTextNode(item[key]));
      if (typeof item[key] == 'number') {
        td.style.textAlign = 'right';
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  document.body.appendChild(table);
}

function buildTableHeader(keys) {
  let header = document.createElement('tr');
  keys.forEach((key) => {
    let th = document.createElement('th');
    th.appendChild(document.createTextNode(key));
    header.appendChild(th);
  });

  return header;
}

(function() {
  let mountains = [
    {name: "Kilimanjaro", height: 5895, country: "Tanzania"},
    {name: "Everest", height: 8848, country: "Nepal"},
    {name: "Mount Fuji", height: 3776, country: "Japan"},
    {name: "Mont Blanc", height: 4808, country: "Italy/France"},
    {name: "Vaalserberg", height: 323, country: "Netherlands"},
    {name: "Denali", height: 6168, country: "United States"},
    {name: "Popocatepetl", height: 5465, country: "Mexico"}
  ];
  buildTable(mountains);
}());
