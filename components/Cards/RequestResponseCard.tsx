import Card from 'antd/es/card';

import styles from './RequestResponseCard.module.css';

import { VerboseRequestResponsePayload } from '../../contexts/RequestResponseProvider';
import { useFormattedRequestResponse } from '../../hooks/useFormattedRequestResponse';

export default function RequestResponseCard({
  data,
  hideHeaders,
}: {
  data: VerboseRequestResponsePayload | null;
  hideHeaders: boolean;
}) {
  const formattedData = useFormattedRequestResponse(data, hideHeaders);

  return (
    <Card className={styles.card}>
      <pre className={styles.content}>{formattedData}</pre>
    </Card>
  );
}
