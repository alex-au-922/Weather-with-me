const sleep = (time) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, time);
  });
};

export default sleep;
