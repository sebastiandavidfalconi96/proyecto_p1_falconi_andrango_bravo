"use client";

import React from "react";
import BooksList from "@/app/books/BooksList";
import Layout from "../dashboard/page";

const BooksPage = () => {
    return (
        <div>
            <Layout>
                <h2 className="text-2xl font-bold mb-6">Lista de Libros</h2>
                <BooksList />
            </Layout>
        </div>
    );
};

export default BooksPage;
