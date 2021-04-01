import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import Header from '../../components/Header';
import { useRouter } from 'next/router';

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
      };
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  // TODO
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>
  }
  const readingTime = Math.ceil(post?.data.content.reduce((acc: number, content) => {
    const text = `${content.heading} ${content.body.text}`;

    return text.split(' ').length + acc;
  }, 0) / 200);

  return (
    <>
      <Header />
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
                <p>{`${readingTime} min`}</p>
              </div>
            </footer>
          </header>


          {post.data.content.map((item, index) => (
            <>
              <h2 key={`${index}-head`}>{item.heading}</h2>
              <div
                key={`${index}-content`}
                className={styles.postContent}
                dangerouslySetInnerHTML={
                  { __html: RichText.asHtml(item.body.text) }
                }
              />
            </>
          ))}
        </article>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ]);

  // TODO
  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid
      }
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
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
            text: [...item.body],
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
