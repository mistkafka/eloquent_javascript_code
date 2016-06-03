function address(state) {
  return function(city) {
    return function(road){
      return state + '省, ' + city + '市, ' + road + '区/县';
    };
  };
}
