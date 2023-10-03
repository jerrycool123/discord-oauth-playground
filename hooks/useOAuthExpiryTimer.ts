import { useContext, useEffect, useState } from 'react';

import { SessionStorageContext } from '../contexts/SessionStorageProvider';
import { isEmptyString } from '../libs/common/validator';

export const useOAuthExpiryTimer = () => {
  const {
    accessToken: [_accessToken, setAccessToken],
    refreshToken: [_refreshToken, setRefreshToken],
    expiresAt: [expiresAt, setExpiresAt],
  } = useContext(SessionStorageContext);

  const [remainingTime, setRemainingTime] = useState(-1);

  useEffect(() => {
    if (isEmptyString(expiresAt)) return;

    const expiresAtSec = parseInt(expiresAt, 10);

    const interval = setInterval(() => {
      const currentSec = Math.floor(Date.now() / 1000);
      const remainingTime = expiresAtSec - currentSec;
      setRemainingTime(remainingTime);
      if (remainingTime === 0) {
        setRemainingTime(-1);
        setAccessToken('');
        setRefreshToken('');
        setExpiresAt('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, setAccessToken, setExpiresAt, setRefreshToken]);

  return remainingTime;
};
