import { useGetAllBlogCategoriesQuery, useGetAllBlogsQuery } from "@/state/api";
import React, { useState } from "react";
import DOMPurify from "dompurify";
import PrimaryButton from "@/components/PrimaryButton";

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: dataCategories,
    error: errorFetchingCategories,
    isLoading: isLoadingCategories,
  } = useGetAllBlogCategoriesQuery();
  const {
    data: dataBlogs,
    error: errorDataBlogs,
    isLoading: isLoadingDataBlogs,
  } = useGetAllBlogsQuery();

  const categories = Array.isArray(dataCategories?.categories)
    ? dataCategories.categories
    : [];

  const blogs = Array.isArray(dataBlogs?.blogs) ? dataBlogs.blogs : [];

  const filteredPosts = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "" ||
      blog.categories.some((category) => category === selectedCategory);

    const matchesSearchQuery = blog.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearchQuery;
  });

  return (
    <section
      id="blog"
      className="py-28 bg-background-alt-light dark:bg-background-color text-primary-500 dark:text-white min-h-full"
    >
      <div className="mx-auto w-5/6 ">
        <header className="text-center mb-4 ">
          <h1 className="text-3xl font-bold mb-1">Blogs</h1>
          <p>
            Fica em forma com as nossas dicas de treino, nutrição e saúde.
            <br />
            Aprende tudo sobre como alcançar os teus objetivos!
          </p>
        </header>

        {/* Search input */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Pesquisar por título..."
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block p-2.5 dark:bg-background-alt dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "80%" }}
          />

          {/* Category dropdown */}
          {errorFetchingCategories ? (
            <select
              className="ml-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block p-2.5 dark:bg-background-alt dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400"
              style={{ width: "20%" }}
            >
              <option value="">{`Erro ao carregar as categorias`}</option>
            </select>
          ) : (
            <select
              className="ml-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block p-2.5 dark:bg-background-alt dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-400 dark:focus:border-secondary-400"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: "20%" }}
            >
              <option value="">{`Todas as categorias`}</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Blog posts grid */}
        {errorDataBlogs ? (
          <p className="text-center text-red-500 mt-6 min-h-full">
            Ocorreu um erro ao carregar os blogs. Por favor tente novamente mais
            tarde
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoadingCategories || isLoadingDataBlogs
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    role="status"
                    className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                      <svg
                        className="w-10 h-10 text-gray-200 dark:text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                      </svg>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    <div className="flex items-center mt-4">
                      <svg
                        className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                      </svg>
                      <div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                        <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                    </div>
                    <span className="sr-only">A carregar...</span>
                  </div>
                ))
              : filteredPosts.map((blog) => (
                  <div
                    key={blog.blogId}
                    className="p-4 bg-background-color-light dark:bg-background-alt rounded-lg shadow hover:shadow-lg transition"
                  >
                    {/* Blog cover image */}
                    <img
                      src={blog.coverImageUrl}
                      alt={blog.title}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />

                    {/* Blog title */}
                    <h2 className="text-xl font-bold">
                      {blog.title.length > 20
                        ? blog.title.slice(0, 20) + "..."
                        : blog.title}
                    </h2>

                    {/* Blog categories */}
                    <p className="text-sm mb-2 text-partial-black dark:text-selected-background">
                      {blog.categories.length > 4
                        ? blog.categories.slice(0, 4).join(" | ") +
                          " | e mais..."
                        : blog.categories.join(" | ")}
                    </p>

                    {/* Blog body */}
                    <p
                      className="text-sm mb-4 text-partial-black dark:text-selected-background break-words"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          blog.body.length > 35
                            ? blog.body.slice(0, 35) + "..."
                            : blog.body
                        ),
                      }}
                    />

                    {/* Authors section */}
                    <div className="flex justify-between mt-2">
                      <div className="flex-col items-center">
                        {blog.authors.slice(0, 2).map((author, index) => (
                          <div
                            key={index}
                            className="flex items-center ml-2 my-4"
                          >
                            <img
                              src={author.profilePictureUrl}
                              alt={`${author.firstName} ${author.lastName}`}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="ml-2">{author.firstName}</span>{" "}
                            {index === 1 && blog.authors.length > 2 && (
                              <span className="ml-4 text-secondary-600">
                                e mais autores...
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* "Learn more" button */}
                    <div className="w-full text-center">
                      <PrimaryButton
                        label={"Saiba mais"}
                        navigateTo={`blog/${blog.blogId}`}
                      />
                    </div>

                    {/* Blog update date */}
                    <p className="text-gray-500 mt-3">
                      Data: {new Date(blog.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
          </div>
        )}

        {filteredPosts.length === 0 &&
          !errorFetchingCategories &&
          !errorDataBlogs && (
            <p className="text-center text-gray-500 mt-6 min-h-full">
              Ainda não temos nenhum blog disponível para as suas preferências,
              por favor tente novamente mais tarde.
            </p>
          )}
      </div>
    </section>
  );
};

export default Blog;
