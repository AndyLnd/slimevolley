export function createKeyHandler() {
  const keyMap = new Set();
  const funcMap = {};
  const singleFuncMap = {};
  document.addEventListener('keydown', ({key}) => {
    singleFuncMap[key] && singleFuncMap[key]();
    keyMap.add(key);
  });
  document.addEventListener('keyup', ({key}) => keyMap.delete(key));

  return {
    addFunction: (keys, keyFunction) => [].concat(keys).forEach(key => (funcMap[key] = keyFunction)),
    clearKey: keys => [].concat(keys).forEach(key => (funcMap[key] = singleFuncMap[key] = null)),
    addSingleFunction: (keys, keyFunction) => [].concat(keys).forEach(key => (singleFuncMap[key] = keyFunction)),
    poll: () => keyMap.forEach(key => funcMap[key] && funcMap[key]()),
  };
}