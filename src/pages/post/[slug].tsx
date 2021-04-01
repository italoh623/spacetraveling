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
import Head from 'next/head';
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
      }[];
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

  const totalWords = post.data.content.reduce((total, contentItem) => {
    total += contentItem.heading.split(' ').length;

    const words = contentItem.body.map(item => item.text.split(' ').length);
    words.map(word => (total += word));

    return total;
  }, 0);

  const readingTime = Math.ceil(totalWords / 200);

  const formatedDate = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    { locale: ptBR }
  )

  return (
    <>
      <Head>
        <title>{`${post.data.title} | spacetraveling`}</title>
      </Head>
      <Header />
      <img src={post.data.banner.url} alt={post.data.title} className={styles.banner} />
      <div className={styles.container}>
        <article>
          <header>
            <h1>{post.data.title}</h1>
            <footer>
              <div>
                <FiCalendar size={'1.25rem'} className={styles.icon} />
                <time>{formatedDate}</time>
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
            <div key={item.heading}>
              <h2>{item.heading}</h2>
              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={
                  { __html: RichText.asHtml(item.body) }
                }
              />
            </div>
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
    first_publication_date: response.first_publication_date,
    data: {
      title: RichText.asText(response.data.title),
      banner: {
        url: response.data.banner.url,
      },
      author: RichText.asText(response.data.author),
      content: response.data.content.map(item => {
        return {
          heading: RichText.asText(item.heading),
          body: [...item.body],
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
