import { useState, useCallback } from 'react';

const useinput = (initialValue = null) => {
  const [value, setValue] = useState(initialValue);
  // ex) handler는 onChange**와 같다. 변화되는 상태를 감지한다.
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  return [value, handler];
};

export default useinput;
