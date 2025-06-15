import React from 'react';

const NewsFeed = ({ news }) => (
  <div>
    <h2>News Feed</h2>
    <ul>
      {news.map((n, i) => (
        <li key={i}>{n}</li>
      ))}
    </ul>
  </div>
);

export default NewsFeed;
