const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = graphql; //destructuring object from graphql

//using GraphQLID is better for primary key in a schema cause it could contains strings or number type with no error

// books dummy data for testing
// let books = [
//   { id: "1", name: "Harry Potter", genre: "Fantasy", authorId: "1" },
//   { id: "2", name: "CSS Learn The Way", genre: "Education", authorId: "2" },
//   { id: "3", name: "React JS Fundamental", genre: "Education", authorId: "3" },
//   {
//     id: "4",
//     name: "SASS - Begin the web design journey",
//     genre: "Education",
//     authorId: "2",
//   },
//   { id: "5", name: "SASS Fundamental", genre: "Education", authorId: "3" },
//   { id: "6", name: "Progressive Web APP", genre: "Education", authorId: "3" },
// ];

// authors dummy data for testing
// let authors = [
//   { id: "1", name: "J.K Rowling", age: 38 },
//   { id: "2", name: "Deni Arman", age: 25 },
//   { id: "3", name: "Muhammad Rizki Akbar", age: 24 },
// ];

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      // this relational is one to many type from AuthorType to BookType this means (one Author has Many Books)
      type: new GraphQLList(BookType), //GraphQLList is defined as type of books field cause an author had a collection books or the other reason is two relational type (one to many)
      resolve(parent, args) {
        //return _.filter(books, { authorId: parent.id });
        return Book.find({ authorId: parent.id });
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      // this relational is one to one type from BookType to AuthorType this means (one book has one author)
      type: AuthorType,
      resolve(parent, args) {
        //return _.find(authors, { id: parent.authorId }); //this is finding a record or return a local dummy data with lodash _
        return Author.findById(parent.authorId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Root Query",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return _.find(books, { id: args.id }); //get data from dummy resources
        return Book.findById(args.id); //code to get data from db / other sources
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return _.find(authors, { id: args.id });
        return Author.findById(args.id);
      },
    },
    books: {
      //add a  new object for all the lists of book
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return books; //return the books dummy data that we have declared
        return Book.find({});
      },
    },
    authors: {
      //same as books object
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        //return authors;
        return Author.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        // let book = new Book({
        //   name: args.name,
        //   genre: args.genre,
        //   authorId: args.authorId,
        // });
        return Book(args).save(); //u can directly do this like ModelName(args).save() or create a variable that store the argument.
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
