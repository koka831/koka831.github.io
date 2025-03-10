import { Layout } from "../components";
import styles from "./404.module.css";

const NotFound = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.message}>404/Not Found</h2>
      </div>
    </Layout>
  );
};

export default NotFound;
