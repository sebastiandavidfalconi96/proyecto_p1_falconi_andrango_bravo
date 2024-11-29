"use client";

import React from "react";
import Users from "@/app/users/UsersList";
import Layout from "../dashboard/page";

const BooksPage = () => {
    return (
        <div>
            <Layout>
                <h2 className="text-2xl font-bold mb-6">Usuarios</h2>
                <Users />
            </Layout>
        </div>
    );
};

export default BooksPage;
