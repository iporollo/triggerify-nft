import { TrollFace } from '../images';
import styles from '../../styles/Home.module.css';

const AppFooter: React.FC = () => (
  <footer className={styles.footer}>
    <div>
      Built with <TrollFace width={24} heigh={24} /> by
      <a
        href="https://twitter.com/iporollo"
        target="_blank"
        rel="noopener noreferrer"
      >
        @iporollo
      </a>
    </div>
    <div>
      Inspired by
      <a href="https://triggerify.me" target="_blank" rel="noopener noreferrer">
        triggerify.me
      </a>
      from
      <a
        href="https://twitter.com/fillippeyton"
        target="_blank"
        rel="noopener noreferrer"
      >
        @fillippeyton
      </a>
    </div>
  </footer>
);

export default AppFooter;
