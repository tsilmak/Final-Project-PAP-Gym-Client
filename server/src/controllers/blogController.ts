import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AuthController {
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await prisma.blogCategory.findMany();
      res.json({
        categories,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getAllBlogs(req: Request, res: Response): Promise<void> {
    try {
      // Fetch all blogs with specific fields
      const blogs = await prisma.blog.findMany({
        where: {
          published: true, // Filter by published status
        },
        orderBy: {
          updatedAt: "desc",
        },

        include: {
          categories: {
            select: {
              category: {
                select: {
                  name: true, // Select category name
                },
              },
            },
          },
          authors: {
            select: {
              user: {
                select: {
                  fname: true, // Select the user's first name
                  lname: true, // Select the user's last name
                  profilePictureUrl: true, // Select the user's profile picture URL
                },
              },
            },
          },
        },
      });

      const formattedBlogs = blogs.map((blog) => ({
        blogId: blog.blogId,
        title: blog.title,
        body: blog.body,
        coverImageUrl: blog.coverImageUrl,
        published: blog.published,
        updatedAt: blog.updatedAt.toISOString().split("T")[0], //update date to yyyy-mm-dd
        categories: blog.categories.map((cat) => cat.category.name), // Extract category names
        authors: blog.authors.map((author) => ({
          firstName: author.user.fname,
          lastName: author.user.lname,
          profilePictureUrl: author.user.profilePictureUrl,
        })),
      }));
      res.json({
        blogs: formattedBlogs,
      });
    } catch (error: any) {
      // Handle any error that might occur during the query
      console.error("Error fetching blogs:", error);

      // Respond with a 500 status and an error message
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
  async getBlogById(req: Request, res: Response): Promise<void> {
    const blogId = req.params.blogId;

    // Check if blogId is provided
    if (!blogId) {
      res.status(400).json({ message: "Blog ID is required" }); // Changed status code to 400 (Bad Request)
      return;
    }

    try {
      // Fetch the blog with related categories and authors
      const blog = await prisma.blog.findUnique({
        where: {
          blogId: blogId, // Filter by blogId
          published: true, // Ensure the blog is published
        },
        include: {
          categories: {
            select: {
              category: {
                select: {
                  name: true, // Select category name
                },
              },
            },
          },
          authors: {
            select: {
              user: {
                select: {
                  fname: true, // First name of author
                  lname: true, // Last name of author
                  profilePictureUrl: true, // Profile picture URL
                  role: {
                    select: {
                      rolesName: true, // Selecting the role name from the related Roles table
                    },
                  },
                },
              },
            },
          },
        },
      });

      // If blog is not found, return a 404 response
      if (!blog) {
        res.status(404).json({ message: "Blog not found" });
        return;
      }

      // Safely check and extract categories and authors
      const formattedBlog = {
        blogId: blog.blogId,
        title: blog.title,
        body: blog.body,
        coverImageUrl: blog.coverImageUrl,
        published: blog.published,
        updatedAt: blog.updatedAt.toISOString().split("T")[0], // Convert date to 'yyyy-mm-dd'
        categories: blog.categories.map(
          (cat: { category: { name: string } }) => cat.category.name // Extract category names
        ),
        authors: blog.authors.map((author) => ({
          firstName: author.user.fname,
          lastName: author.user.lname,
          role: author.user.role.rolesName,
          profilePictureUrl: author.user.profilePictureUrl,
        })),
      };

      // Return the formatted blog data
      res.json({
        blog: formattedBlog,
      });
    } catch (error: any) {
      console.error("Error fetching blog:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
  async getBlogByCategoryRelated(req: Request, res: Response): Promise<void> {
    try {
      const blogId = req.params.blogId;
      console.log(blogId);
      // Validate blogId
      if (!blogId) {
        res.status(400).json({ message: "Blog ID is required." });
        return;
      }

      // Fetch the blog by blogId to get its categories
      const blog = await prisma.blog.findUnique({
        where: { blogId },
        include: {
          categories: {
            select: {
              category: {
                select: {
                  name: true, // Fetch category names
                },
              },
            },
          },
        },
      });

      // Validate if the blog exists
      if (!blog) {
        res.status(404).json({ message: "Blog not found." });
        return;
      }

      // Extract category names
      const categoryNames = blog.categories.map(
        (cat: { category: { name: string } }) => cat.category.name
      );

      // If no categories are associated, return an empty result
      if (categoryNames.length === 0) {
        res.json({ blog: [] });
        return;
      }

      // Fetch 4 random blogs with matching categories
      const relatedBlogs = await prisma.blog.findMany({
        where: {
          published: true, // Only fetch published blogs
          blogId: { not: blogId }, // Exclude the current blog
          categories: {
            some: {
              category: {
                name: {
                  in: categoryNames, // Match blogs with any of the given categories
                },
              },
            },
          },
        },
        take: 4, // Limit the result to 4 blogs
        orderBy: {
          updatedAt: "desc", // Order by updatedAt as a deterministic fallback
        },
        include: {
          categories: {
            select: {
              category: {
                select: {
                  name: true, // Fetch category name
                },
              },
            },
          },
        },
      });

      // Shuffle the blogs for randomness (optional)
      const shuffledBlogs = relatedBlogs.sort(() => Math.random() - 0.5);

      // Format blogs for response
      const formattedBlogs = shuffledBlogs.map((blog) => ({
        blogId: blog.blogId,
        title: blog.title,
        body: blog.body,
        coverImageUrl: blog.coverImageUrl,
        published: blog.published,
        updatedAt: blog.updatedAt.toISOString().split("T")[0], // Format date as 'yyyy-mm-dd'
        categories: blog.categories.map(
          (cat: { category: { name: string } }) => cat.category.name // Extract category names
        ),
      }));

      // Return the formatted blogs
      res.json({ blogs: formattedBlogs });
    } catch (error: any) {
      console.error("Error fetching related blogs:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

export default new AuthController();
