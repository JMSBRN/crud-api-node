process.on('message', (msg) => {
  if (Array.isArray(msg)) {
    // eslint-disable-next-line no-console
    console.log('Received array from parent:', msg);
    msg.push(6, 7, 8);
    if (process.send) {
      process.send(msg);
    }
  }
});
