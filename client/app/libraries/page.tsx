"use client";

import React from "react";
import LibraryList from "@/app/libraries/LibraryList";
import Layout from "../dashboard/page";

const LibrariesPage = () => {
  return (
    <div>
      <Layout>
        <h2 className="text-2xl font-bold mb-6">Lista de Bibliotecas</h2>
        <LibraryList />
      </Layout>
    </div>
  );
};

export default LibrariesPage;
