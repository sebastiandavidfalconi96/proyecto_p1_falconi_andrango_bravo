class BookDTO {
  constructor({ id, title, author, isbn, price, isRented, isLoaned, category, inventoryCount, location, publicationYear, isActive }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.price = price;
    this.isRented = isRented;
    this.isLoaned = isLoaned;
    this.category = category;
    this.inventoryCount = inventoryCount;
    this.location = location;
    this.publicationYear = publicationYear;
    this.isActive = isActive;  // Nuevo campo
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

  setISBN(isbn) { // Nuevo método
    this.book.isbn = isbn;
    return this;
  }

  setPublicationYear(publicationYear) {
    this.book.publicationYear = publicationYear;
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

  setCategory(category) {
    this.book.category = category;
    return this;
  }

  setInventoryCount(inventoryCount) { // Nuevo método
    this.book.inventoryCount = inventoryCount;
    return this;
  }

  setLocation(location) { // Nuevo método
    this.book.location = location;
    return this;
  }

  setIsActive(isActive) {
    this.book.isActive = isActive;  // Establecer el estado de activo/inactivo
    return this;
  }

  build() {
    return new BookDTO(this.book);
  }
}

module.exports = { BookDTO, BookDTOBuilder };
