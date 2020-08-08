import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import ReactLoading from "react-loading";
import {
  getAuthorsQuery,
  addBookMutation,
  getBooksQuery,
} from "../queries/queries";

function AddBook() {
  const [state, setState] = useState({
    name: "",
    genre: "",
    authorId: "",
  });

  const { loading, error, data } = useQuery(getAuthorsQuery);
  const [addBook] = useMutation(addBookMutation);
  const { name, genre, authorId } = state;

  if (error) console.log(error);
  if (loading) {
    return (
      <ReactLoading type="bars" color="black" height={"5%"} width={"5%"} />
    );
  } else {
    return (
      <div id="add-book-wrapper">
        <form
          id="add-book"
          onSubmit={(e) => {
            e.preventDefault();
            addBook({
              variables: { name, genre, authorId },
              refetchQueries: [{ query: getBooksQuery }], // Don't forget re-fetch the queries :D LOL, cause it'll be render in front-end later
            });
          }}
        >
          <div className="field">
            <label>Book Name :</label>
            <input
              type="text"
              onChange={(e) => setState({ ...state, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Genre :</label>
            <input
              type="text"
              onChange={(e) => setState({ ...state, genre: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Author :</label>
            <select
              onChange={(e) => setState({ ...state, authorId: e.target.value })}
            >
              <option>Select Author</option>
              {data.authors.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">+</button>
        </form>
      </div>
    );
  }
}

export default AddBook;
