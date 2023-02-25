process.on('message', (msg) => {
  if (msg != null && typeof msg === 'object') {
    // eslint-disable-next-line no-console
    // @ts-ignore
    console.log('Received object from parent:', msg.data);
    // eslint-disable-next-line no-console
    const updatedMsg = { ...msg, data: [3, 4, 5] };
    if (process.send) {
      process.send(updatedMsg);
    }
  }
});
