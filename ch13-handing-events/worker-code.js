// receive message from host
addEventListener('message', (event) => {

  // web workder is working.... is long time running
  let rslt = Math.pow(2, event.data);

  // send result message to the host
  postMessage(rslt);
});
