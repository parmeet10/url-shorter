import status from '../configs/status.js';

const wrap = (inputFunction) => {
  return async (...args) => {
    try {
      return await inputFunction.apply(this, args);
    } catch (e) {
      console.error(e);
      const cb = args.length !== 1 ? args[args.length - 1] : undefined;

      if (e.message) {
        console.log(new Date().toISOString(), status.getStatus(e.message));
        return cb
          ? cb(status.getStatus(e.message))
          : status.getStatus(e.message);
      } else {
        console.error(e);
        return cb
          ? cb(status.getStatus('generic_fail'))
          : status.getStatus('generic_fail');
      }
    }
  };
};

export default { wrap: wrap };
