import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  // TODO
  const time = 4;
  return (
    <>
      <img src={post.data.banner.url} alt={post.data.title} className={styles.banner} />
      <div className={styles.container}>
        <article>
          <header>
            <h1>{post.data.title}</h1>
            <footer>
              <div>
                <FiCalendar size={'1.25rem'} className={styles.icon} />
                <time>{post.first_publication_date}</time>
              </div>
              <div>
                <FiUser size={'1.25rem'} className={styles.icon} />
                <p>{post.data.author}</p>
              </div>
              <div>
                <FiClock size={'1.25rem'} className={styles.icon} />
                <p>{`${time} min`}</p>
              </div>
            </footer>
          </header>


          {post.data.content.map(item => (
            <>
              <h2>{item.heading}</h2>
              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{ __html: item.body.text }}
              />
            </>
          ))}
        </article>
      </div>
    </>
  )
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  // TODO
  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM yyyy',
      { locale: ptBR }
    ),
    data: {
      title: RichText.asText(response.data.title),
      banner: {
        url: response.data.banner.url,
      },
      author: RichText.asText(response.data.author),
      content: response.data.content.map(item => {
        return {
          heading: RichText.asText(item.heading),
          body: {
            text: RichText.asHtml(item.body),
          },
        }
      }),
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30 // 30 minutes
  }
};
