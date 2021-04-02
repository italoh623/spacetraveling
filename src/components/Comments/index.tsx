import { Component, useEffect } from 'react';

const Comments = () => {

  useEffect(() => {
    document.getElementById
    const script = document.createElement('script');
    const anchor = document.getElementById('inject-comments-for-uterances');

    if (anchor.children.length > 0) {
      anchor.removeChild(anchor.children[0]);
    }

    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    script.setAttribute(
      'repo',
      'italoh623/spacetraveling'
    );
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'dark-blue');
    anchor.appendChild(script);
  });

  return (
    <div
      id="inject-comments-for-uterances"
      style={{ marginBottom: '4rem' }}
    />
  );
}

export default Comments;