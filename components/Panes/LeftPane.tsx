'use client';

import Collapse, { type CollapseProps } from 'antd/es/collapse';
import Switch from 'antd/es/switch';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

import styles from './LeftPane.module.css';

import { APIRequestBuilderProvider } from '../../contexts/APIRequestBuilderProvider';
import { SessionStorageContext } from '../../contexts/SessionStorageProvider';
import { ThemeContext } from '../../contexts/ThemeProvider';
import { useToken } from '../../hooks/useDesignToken';
import { isEmptyString } from '../../libs/common/validator';
import Step1 from '../Steps/Step1';
import Step2 from '../Steps/Step2';
import Step3 from '../Steps/Step3';

export default function LeftPane() {
  const params = useSearchParams();
  const { colorStyle } = useToken();

  const {
    darkTheme: [isDarkTheme, setIsDarkTheme],
  } = useContext(ThemeContext);
  const {
    clientId: [clientId],
    scopes: [scopes],
  } = useContext(SessionStorageContext);

  const [init, setInit] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const steps: CollapseProps['items'] = [
    {
      key: 1,
      label: 'Step 1: Enter Discord App credentials & Authorize',
      onItemClick: () => setActiveStep(1),
      children: <Step1 />,
    },
    {
      key: 2,
      label: 'Step 2: Exchange authorization code for tokens',
      onItemClick: () => setActiveStep(2),
      children: <Step2 setActiveStep={setActiveStep} />,
    },
    {
      key: 3,
      label: 'Step 3: Make a request to Discord API',
      onItemClick: () => setActiveStep(3),
      children: (
        <APIRequestBuilderProvider>
          <Step3 setActiveStep={setActiveStep} />
        </APIRequestBuilderProvider>
      ),
    },
  ];

  useEffect(() => {
    if (init === true) return;
    setInit(true);

    const code = params.get('code');
    if (code === null || isEmptyString(clientId) || scopes.length === 0) return;
    setActiveStep(2);
  }, [clientId, init, params, scopes, setActiveStep]);

  return (
    <div className="flex-grow-1 d-flex flex-column">
      <div className="flex-shrink-0 d-flex align-items-center mt-2 mb-3">
        <Switch
          className="me-2"
          size="small"
          checked={isDarkTheme}
          onChange={() => setIsDarkTheme((d) => !d)}
        />
        <div style={{ ...colorStyle }}>Dark Theme</div>
      </div>
      <div className="flex-grow-1 d-flex flex-column">
        <Collapse
          className={`${styles.collapse} flex-grow-1 d-flex flex-column`}
          size="small"
          accordion
          activeKey={activeStep}
          items={steps}
        />
      </div>
    </div>
  );
}
