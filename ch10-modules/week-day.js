const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

exports.name = function(number) {
  return days[number];
};

exports.number = function(name) {
  return days.indexOf(name);
};
