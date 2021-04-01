import { GetStaticProps } from 'next';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';
import { useEffect, useRef, useState } from 'react';

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

export default function Home({ postsPagination }: HomeProps) {
  // TODO
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [otherPost, setOtherPost] = useState([] as Post[]);

  function loadPosts() {
    var myHeaders = new Headers();

    const myInit = {
      method: 'GET',
      headers: myHeaders,
    };

    if (nextPage) {
      fetch(nextPage, myInit)
        .then(response => response.json())
        .then(data => {

          const posts = data.results.map(post => {
            return {
              uid: post.uid,
              first_publication_date: format(
                new Date(post.first_publication_date),
                'dd MMM yyyy',
                { locale: ptBR }
              ),
              data: {
                title: RichText.asText(post.data.title),
                subtitle: RichText.asText(post.data.subtitle),
                author: RichText.asText(post.data.author),
              },
            }
          });

          setOtherPost([...otherPost, ...posts]);
          setNextPage(data.next_page);
        });
    }
  }

  return (
    <>
      <Header />
      <main className={styles.homeContainer}>
        <div className={styles.homeContent}>
          {postsPagination.results.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <section>
                  <div>
                    <FiCalendar size={'1.25rem'} className={styles.icon} />
                    <time>{post.first_publication_date}</time>
                  </div>
                  <div>
                    <FiUser size={'1.25rem'} className={styles.icon} />
                    <p>{post.data.author}</p>
                  </div>
                </section>
              </a>
            </Link>
          ))}

          {
            otherPost.length > 0 ? (
              otherPost.map(post => (
                <Link href={`/post/${post.uid}`} key={post.uid}>
                  <a>
                    <h1>{post.data.title}</h1>
                    <p>{post.data.subtitle}</p>
                    <section>
                      <div>
                        <FiCalendar size={'1.25rem'} className={styles.icon} />
                        <time>{post.first_publication_date}</time>
                      </div>
                      <div>
                        <FiUser size={'1.25rem'} className={styles.icon} />
                        <p>{post.data.author}</p>
                      </div>
                    </section>
                  </a>
                </Link>
              ))
            ) : <></>
          }

          {
            nextPage ? (
              <button
                onClick={loadPosts}
              >Carregar mais posts</button>
            ) : <></>
          }

        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // TODO
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['post.title', 'post.content'],
    pageSize: 1,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
      data: {
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.subtitle),
        author: RichText.asText(post.data.author),
      },
    }
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
    revalidate: 60 * 60 // 1 hour
  }
};
