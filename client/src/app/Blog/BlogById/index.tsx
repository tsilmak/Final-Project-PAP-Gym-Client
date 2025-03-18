import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  BlogAuthor,
  useGetBlogByCategoryRelatedQuery,
  useGetBlogByIdQuery,
} from "@/state/api";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import PrimaryButton from "@/components/PrimaryButton";
import { ArrowLeft } from "lucide-react";

const BlogById = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetBlogByIdQuery(
    blogId ? { blogId } : { blogId: "" }
  );

  const { data: relatedBlogs, isLoading: isLoadingRelatedBlogs } =
    useGetBlogByCategoryRelatedQuery(blogId || "");
  console.log(relatedBlogs?.blogs[0]);
  const [showAllAuthors, setShowAllAuthors] = useState(false);

  const toggleAuthors = () => {
    setShowAllAuthors(!showAllAuthors);
  };
  const authors = data?.blog?.authors;
  // Limit authors shown if less than "See All"
  const authorsToDisplay = showAllAuthors ? authors : authors?.slice(0, 3); // Show 3 authors by default
  const blogContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Apply Tailwind classes to headings after rendering
    if (blogContentRef.current) {
      const headings = blogContentRef.current.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      );

      headings.forEach((element) => {
        const heading = element as HTMLElement;
        switch (heading.tagName) {
          case "H1":
            heading.classList.add("text-4xl", "font-extrabold");
            break;
          case "H2":
            heading.classList.add("text-3xl", "font-bold");
            break;
          case "H3":
            heading.classList.add("text-2xl", "font-semibold");
            break;
          case "H4":
            heading.classList.add("text-1xl", "font-medium");
            break;
          case "H5":
            heading.classList.add("text-xl", "font-normal");
            break;
          case "H6":
            heading.classList.add("text-lg", "font-light");
            break;
          default:
            break;
        }
      });
    }
  }, [data]);
  return (
    <main className="py-28 bg-background-alt-light dark:bg-background-color ">
      <div className="flex justify-between px-4i  ">
        <article className="mx-auto w-5/6">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className={`
        group
        flex items-center gap-2
        text-gray-600 dark:text-gray-300
        hover:text-gray-900 dark:hover:text-white
        transition-colors duration-200
        font-medium
      `}
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Voltar
            </button>
          </div>
          <header className="lg:mb-6 ">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <address className="mb-4 not-italic">
                  {/* Flex container for authors */}
                  <div className="flex flex-wrap gap-6">
                    {authorsToDisplay?.map(
                      (author: BlogAuthor, index: number) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-900 dark:text-white w-full sm:w-1/2 md:w-1/3 lg:w-1/5"
                        >
                          <img
                            className="mr-4 w-16 h-16 rounded-full"
                            src={author.profilePictureUrl}
                            alt={author.lastName}
                          />
                          <div>
                            <a
                              href="#"
                              rel="author"
                              className="text-xl font-bold text-gray-900 dark:text-white"
                            >
                              {author.firstName}
                            </a>
                            <p className="text-base text-secondary-600 dark:text-secondary-200">
                              {author.role}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </address>

                {authors && authors.length > 3 && (
                  <button
                    onClick={toggleAuthors}
                    className="mt-4 text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {showAllAuthors ? "Show Less" : "See All Authors"}
                  </button>
                )}

                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 lg:text-4xl dark:text-white">
                  {data?.blog?.title}
                </h1>

                {data?.blog.categories?.map((category, index) => (
                  <span
                    key={index}
                    className="mr-2 bg-secondary-200 text-secondary-200 text-xs font-medium px-3 py-0.5 rounded-full dark:bg-secondary-200 dark:text-black"
                  >
                    {category}
                  </span>
                ))}
                <p className="text-gray-500 mt-2">
                  Data:{" "}
                  {data?.blog?.updatedAt
                    ? new Date(data.blog.updatedAt).toLocaleDateString()
                    : "Não Disponivel"}
                </p>
              </>
            )}
          </header>
          <div
            ref={blogContentRef}
            className="mt-4 mb-4 text-partial-black dark:text-white break-words"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data?.blog.body || ""),
            }}
          />
        </article>
      </div>

      {/* RELATED BLOGS IF THERE IS SHOW 4 OF THEM */}
      {!isLoadingRelatedBlogs &&
        relatedBlogs &&
        relatedBlogs?.blogs?.length > 0 && (
          <aside
            aria-label="Related articles"
            className="py-8 lg:py-24 bg-gray-50 dark:bg-background-alt"
          >
            <div className="mx-auto max-w-screen-2xl">
              <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
                Blogs relacionados
              </h2>
              <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                {relatedBlogs.blogs.slice(0, 4).map((blog, index) => (
                  <article key={index} className="max-w-xs">
                    <img
                      src={
                        blog.coverImageUrl || "https://via.placeholder.com/150"
                      }
                      className="mb-5 rounded-lg"
                      alt={blog.title || "Blog image"}
                    />
                    <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
                      {blog.title && blog.title.length > 20
                        ? blog.title.slice(0, 20) + "..."
                        : blog.title || "Blog sem título"}
                    </h2>
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

                    <div className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500">
                      <PrimaryButton
                        label={"Ver Mais"}
                        navigateTo={`blog/${blog.blogId}` || null}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        )}
    </main>
  );
};

export default BlogById;
