import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import { FiCalendar, FiUser } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  // TODO
  return (
    <main className={styles.homeContainer}>
      <div className={styles.homeContent}>
        <a href="">
          <h1>Como ultilizr Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <section>
            <div>
              <FiCalendar className={styles.icon} />
              <time> 15 Mar 2021</time>
            </div>
            <div>
              <FiUser className={styles.icon} />
              <p>Joseph Oliveira</p>
            </div>
          </section>
        </a>

        <a href="">
          <h1>Como ultilizr Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <section>
            <div>
              <FiCalendar className={styles.icon} />
              <time> 15 Mar 2021</time>
            </div>
            <div>
              <FiUser className={styles.icon} />
              <p>Joseph Oliveira</p>
            </div>
          </section>
        </a>

        <a href="">
          <h1>Como ultilizr Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <section>
            <div>
              <FiCalendar className={styles.icon} />
              <time> 15 Mar 2021</time>
            </div>
            <div>
              <FiUser className={styles.icon} />
              <p>Joseph Oliveira</p>
            </div>
          </section>
        </a>

        <a href="">
          <h1>Como ultilizr Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <section>
            <div>
              <FiCalendar className={styles.icon} />
              <time> 15 Mar 2021</time>
            </div>
            <div>
              <FiUser className={styles.icon} />
              <p>Joseph Oliveira</p>
            </div>
          </section>
        </a>

        <button>Carregar mais posts</button>
      </div>
    </main>
  )
}

export const getStaticProps = async () => {
  // const prismic = getPrismicClient();
  // const postsResponse = await prismic.query(TODO);

  // TODO
  return {
    props: {

    }
  }
};
