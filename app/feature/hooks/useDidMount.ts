import { useEffect } from 'react';

export const useDidMount = (func: Function) => {
  useEffect(() => {
    func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
