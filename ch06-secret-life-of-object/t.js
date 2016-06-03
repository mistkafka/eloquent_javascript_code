function Role(health, power) {
  this._health = health;
  this._power = power;
}

Object.defineProperty(Role.prototype, 'health', {
  get: function() {
    return this._health;
  },
  set: function(value) {
    if (this._health < 0) {
      return {success: false, message: 'the target had deaded'};
    }
    if (value > 100 || value < 0) {
      return {success: false, message: 'the health value should in [0, 100]'};
    }
    return {success: true, messaeg: 'the health value is ' + value + ' now!'};
  },
});

var MistKafka = new Role(78, 99);

console.log(MistKafka.health);
console.log(MistKafka.health = 200);
console.log(MistKafka.health);
