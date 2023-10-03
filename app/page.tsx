import styles from './Home.module.css';

import LeftPane from '../components/Panes/LeftPane';
import RightPane from '../components/Panes/RightPane';

export default function Home() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6 d-flex flex-column vh-100 py-3">
          <LeftPane />
        </div>
        <div className={`col-lg-6 d-flex flex-column ${styles.wrapper} py-3`}>
          <RightPane />
        </div>
      </div>
    </div>
  );
}
