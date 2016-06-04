function testConfirm() {
  console.log(confirm('test confirm'));
}

(function(){
  addEventListener('load', function() {
    console.log('page load done.');
  });
  addEventListener('beforeunload', function(event) {
    return 'If you confirm to leave this page?';
  });
}());
