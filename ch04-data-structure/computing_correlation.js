var journal = require('./jacques_journal');

function phi(table) {
  return (table[3] * table[0] - table[1] * table[2]) /
    Math.sqrt((table[3] + table[2]) *
              (table[1] + table[0]) *
              (table[3] + table[1]) *
              (table[2] + table[0])
    );
}

function has_event(entry, event) {
  return entry.events.indexOf(event) != -1;
}

function phi_table(event, journal) {
  var table = [0, 0, 0, 0];
  for (var i = 0; i < journal.length; i++) {
    var entry = journal[i];
    var index = 0;

    if (has_event(entry, event)) {
      index += 1;
    }

    if (entry.squirrel) {
      index += 2;
    }

    table[index] += 1;
  }

   return table;
}

function jacques_phi(event) {
  console.log(event + ' and squirrel: ' + phi(phi_table(event, journal)));
}

function find_new_events(events, found_events) {
  var newEvents = [];
  for (var i = 0; i < events.length; i++) {
    if (found_events.indexOf(events[i]) == -1) {
      newEvents.push(events[i]);
    }
  }
  return newEvents;
}

function get_event_types(journal) {
  var found_events = [];
  for (var i = 0; i < journal.length; i++) {
    var newEvents = find_new_events(journal[i].events, found_events);
    found_events = found_events.concat(newEvents);
  }
  return found_events;
}

var event_types = get_event_types(journal);
for (var i = 0; i < event_types.length; i++) {
  jacques_phi(event_types[i]);
}
