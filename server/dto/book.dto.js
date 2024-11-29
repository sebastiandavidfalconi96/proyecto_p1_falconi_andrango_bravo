class BookDTO {
    constructor({ id, title, author, price, isRented, isLoaned }) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.price = price;
      this.isRented = isRented;
      this.isLoaned = isLoaned;
    }
  }
  
  class BookDTOBuilder {
    constructor() {
      this.book = {};
    }
  
    setId(id) {
      this.book.id = id;
      return this;
    }
  
    setTitle(title) {
      this.book.title = title;
      return this;
    }
  
    setAuthor(author) {
      this.book.author = author;
      return this;
    }
  
    setPrice(price) {
      this.book.price = price;
      return this;
    }
  
    setIsRented(isRented) {
      this.book.isRented = isRented;
      return this;
    }
  
    setIsLoaned(isLoaned) {
      this.book.isLoaned = isLoaned;
      return this;
    }
  
    build() {
      return new BookDTO(this.book);
    }
  }
  
  module.exports = { BookDTO, BookDTOBuilder };
  