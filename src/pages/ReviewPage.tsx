import { useState } from 'react';
import { items } from '../data/items';

export default function ReviewPage() {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const item = items[index];

  function next() {
    setIndex((current) => (current + 1) % items.length);
    setShowAnswer(false);
  }

  return (
    <div>
      <h1>Review</h1>

      <h2>{item.english}</h2>

      {showAnswer ? (
        <>
          <p>{item.lebanese}</p>
          <button onClick={next}>Next</button>
        </>
      ) : (
        <button onClick={() => setShowAnswer(true)}>Show answer</button>
      )}
    </div>
  );
}
