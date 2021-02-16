const throttle = <T extends []>(
  cb: (..._: T) => void,
  wait = 500 /* ms */
): (..._: T) => void => {
  let queued: boolean;

  const invoke = (...args: T) => {
    if (!queued) {
      queued = true;
      cb(...args);
      setTimeout(() => { queued = false; }, wait);
    }
  };

  return invoke;
};

export default throttle;
