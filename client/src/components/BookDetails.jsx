import React from "react";
import { useQuery } from "@apollo/client";
import { getBookQuery } from "../queries/queries";

function BookDetails({ bookId }) {
  const { loading, data, error } = useQuery(getBookQuery, {
    variables: {
      id: bookId,
    },
  });
  console.log(data);
  return (
    <div id="book-details">
      {loading || !data.book ? (
        <p>No Books Selected</p>
      ) : (
        <>
          <h2>{data.book.name}</h2>
          <p>Genre : {data.book.genre}</p>
          <p>Author : {data.book.author.name}</p>
          <p>All books by this author</p>
          <ul className="other-books">
            {data.book.author.books.map(({ id, name }) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default BookDetails;
