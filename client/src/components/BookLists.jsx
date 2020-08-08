import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import ReactLoading from "react-loading";
import { getBooksQuery } from "../queries/queries";
import BookDetails from "./BookDetails";

function BookLists() {
  const [state, setState] = useState({
    selected: null,
  });
  const { loading, data, error } = useQuery(getBooksQuery);
  const { selected } = state;

  if (error) return console.log(error);
  if (loading) {
    return (
      <ReactLoading type="bars" color="black" height={"5%"} width={"5%"} />
    );
  } else {
    return (
      <div>
        <ul id="book-list">
          {data.books.map((book) => (
            <li
              key={book.id}
              onClick={(e) => {
                setState({ selected: book.id });
              }}
            >
              {book.name}
            </li>
          ))}
        </ul>
        <BookDetails bookId={selected} />
      </div>
    );
  }
}

export default BookLists;
