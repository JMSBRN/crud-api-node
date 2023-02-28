process.on('message', (msg) => {
  let users = [];
  if (msg != null && typeof msg === 'object') {
    // @ts-ignore
    // eslint-disable-next-line no-console
    console.log('Received object from parent:', msg);
    // @ts-ignore
    switch (msg.type) {
      case 'GET':
        // @ts-ignore
        users = [1, 2, 3];
        if (process.send) {
          process.send({ ...msg, data: users });
        }
        return;
      case 'POST':
        // @ts-ignore
        if (process.send) {
          process.send({ ...msg, data: users });
        }
        break;
      default:

        break;
    }
  }
});
