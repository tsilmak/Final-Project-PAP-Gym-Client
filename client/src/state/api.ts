import { RootState } from "@/app/redux";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredetials } from "./authSlice";

export interface ApiErrorResponse {
  data?: {
    message: string;
  };
}

export interface DecodedToken {
  userId: number;
  exp: number; // Expiration time in seconds
  iat: number; // Subject (e.g., user ID)
}
export interface BlogCategory {
  categories: {
    categoryId: number;
    name: string;
  }[];
}
export type BlogAuthor = {
  firstName: string;
  lastName: string;
  role: string;
  profilePictureUrl: string;
};

export type Blog = {
  blogs: {
    blogId: string; // UUID type as a string
    title: string;
    body: string; //string that holds HTML
    coverImageUrl: string;
    coverImagePublicId: string;
    published: boolean;
    updatedAt: string; // yyyy-mm-dd string format for datetime
    categories: string[]; // Array of category names (strings)
    authors: BlogAuthor[]; // Array of authors, each of type BlogAuthor
  }[];
};
export type IndividualBlog = {
  blog: {
    blogId: string; // UUID type as a string
    title: string;
    body: string; //string that holds HTML
    coverImageUrl: string;
    coverImagePublicId: string;
    published: boolean;
    updatedAt: string; // yyyy-mm-dd string format for datetime
    categories: string[]; // Array of category names (strings)
    authors: BlogAuthor[]; // Array of authors, each of type BlogAuthor
  };
};
export interface GymPlan {
  gymPlanId: number;
  features: { feature: string }[];
  price: number;
  name: string;
  isHighlightedPlan: boolean;
}
export interface Signature {
  signatures: {
    gymPlanId: number;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    price: number;
    userId: number;
    gymPlan: GymPlan;
  }[];
}
[];

export interface Payments {
  date: string;
  amount: number;
  paymentId: number;
  paymentStatusName: string;
  title: string;
}

export interface User extends Signature {
  countryNif?: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: string;
  birthDate: string;
  docType: string;
  docNumber: string;
  profilePictureUrl: string;
  nif: string;
  address: string;
  address2?: string;
  zipcode: string;
  country: string;
  membershipNumber: number;
  city: string;
  gymPlanId: number;
  userId: number;
}
export interface RefreshResponse extends User {
  accessToken: string;
  user: User;
}
export interface verifyPaymentResponse {
  paymentDate: string;
  paymentStatus: string;
  paymentAmount: number;
  paymentUserEmail: string;
  paymentIdFromDb: number;
  paymentDescription: string;
}
export interface ClassType {
  classTypeId: number;
  name: string;
  color: string;
}

export interface Exercise {
  exerciseId: number;
  exerciseName?: string;
  name: string;
  imageUrl: string;
  targetMuscle: string;
  exerciseType: string;
  sets: number;
  reps: number;
  weight: number;
}
export interface Workout {
  workoutPlanId: string;
  madeByUser: User;
  updatedAt?: string;
  createdAt: string;
  name: string;
  exercises: Exercise[];
  targetMuscles: string[];
}

export interface Machine {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (
  args: Parameters<typeof baseQuery>[0],
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2]
) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log("result", result?.error?.status);

  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // Send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
    const data = refreshResult?.data as RefreshResponse;

    if (data) {
      // Store the new token
      api.dispatch(
        setCredetials({
          accessToken: data.accessToken,
          user: data.user,
        })
      );

      // Retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};
export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "clientApi",
  tagTypes: [
    "GymPlans",
    "User",
    "Payments",
    "BlogCategory",
    "Blog",
    "Signature",
    "ClassType",
    "Equipment",
    "Workout",
  ],
  //build.mutation<ReturnType, RequestType>
  endpoints: (build) => ({
    //Refresh Token
    refresh: build.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
    }),
    // AUTH
    userRegistration: build.mutation<
      {
        paymentId: number;
        amountToPay: number;
        paymentToken: string;
        accessToken: string;
        user: User;
      },
      User
    >({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    userLogin: build.mutation<
      { accessToken: string; user: User },
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["User"],
    }),

    userLogout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(api.util.resetApiState());
        } catch (err) {
          console.log(err);
        }
      },
    }),
    getClientSecret: build.mutation<
      { clientSecret: string },
      { paymentId: number; amountToPay: number; isSubscription: boolean }
    >({
      query: ({ paymentId, amountToPay, isSubscription }) => ({
        url: "/stripe/create-payment-intent",
        method: "POST",
        body: { paymentId, amountToPay, isSubscription },
      }),
    }),
    getUserPayments: build.mutation<Payments, void>({
      query: () => ({
        url: `/payments/user-payments`,
        method: "POST",
        providesTags: ["Payments"],
      }),
    }),
    getAllBlogCategories: build.query<BlogCategory, void>({
      query: () => ({
        url: `/blog/categories`,
        method: "GET",
        providesTags: ["BlogCategory"],
      }),
    }),
    getBlogByCategoryRelated: build.query<Blog, string>({
      query: (blogId) => ({
        url: `/blog/related/${blogId}`,
        method: "GET",
        providesTags: ["Blog"],
      }),
    }),
    getAllBlogs: build.query<Blog, void>({
      query: () => ({
        url: `/blog/all`,
        method: "GET",
        providesTags: ["Blog"],
      }),
    }),
    getBlogById: build.query<IndividualBlog, { blogId: string }>({
      query: ({ blogId }) => ({
        url: `/blog/${blogId}`,
        method: "GET",
        providesTags: ["Blog"],
      }),
    }),
    verifyPayment: build.query<
      verifyPaymentResponse,
      { paymentIntent: string }
    >({
      query: ({ paymentIntent }) => ({
        url: `/stripe/verify-payment?payment_intent=${paymentIntent}`,
        method: "GET",
      }),
    }),

    getGymPlans: build.query<GymPlan[], void>({
      query: () => "gymPlans",
      providesTags: ["GymPlans"],
    }),
    getGymPlanById: build.query<GymPlan, number>({
      query: (id) => `gymPlans/${id}`,
      providesTags: ["GymPlans"],
    }),

    userChangePassword: build.mutation<
      void,
      { prevPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: ({ prevPassword, newPassword, confirmPassword }) => ({
        url: `user/change/password`,
        method: "POST",
        body: { prevPassword, newPassword, confirmPassword },
      }),
      invalidatesTags: ["User"],
    }),
    changeUserDetails: build.mutation<void, User>({
      query: (data) => ({
        url: `/user/change/details`,
        method: "POST",
        providesTags: ["User"],
        body: data,
      }),
    }),
    userProfile: build.query<User, void>({
      query: () => ({
        url: "user/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    userCheckUnique: build.mutation<void, { email: string; nif: string }>({
      query: ({ email, nif }) => ({
        url: "user/check-if-unique",
        method: "POST",
        body: { email, nif },
      }),
      invalidatesTags: ["User"],
    }),

    getUserSignature: build.mutation<Signature, void>({
      query: () => ({
        url: `/user/signature`,
        method: "POST",
        providesTags: ["Signature"],
      }),
    }),
    changeUserSignatureGymPlan: build.mutation<void, { gymPlanId: number }>({
      query: ({ gymPlanId }) => ({
        url: `/signature/gymplan/change`,
        method: "POST",
        providesTags: ["Signature"],
        body: { gymPlanId },
      }),
    }),
    //Class Type
    getAllClassTypes: build.query<ClassType, void>({
      query: () => ({
        url: `/class/types`,
        method: "GET",
        providesTags: ["ClassType"],
      }),
    }),
    // Classes
    getAllClasses: build.query<void, void>({
      query: () => ({
        url: `/class/classes`,
        method: "GET",
        providesTags: ["Classes"],
      }),
    }),

    //equipment
    getCardioEquipment: build.query<Machine[], void>({
      query: () => ({
        url: `equipment/cardio`,
        method: "GET",
        providesTags: ["Equipment"],
      }),
    }),

    getStrengthEquipment: build.query<Machine[], void>({
      query: () => ({
        url: `equipment/strength`,
        method: "GET",
        providesTags: ["Equipment"],
      }),
    }),

    getFunctionalEquipment: build.query<Machine[], void>({
      query: () => ({
        url: `equipment/functional`,
        method: "GET",
        providesTags: ["Equipment"],
      }),
    }),

    getAllExercises: build.query<Exercise[], void>({
      query: () => ({
        url: `exercise/all`,
        method: "GET",
        providesTags: ["Exercises"],
      }),
    }),

    getUserWorkout: build.mutation<Workout[], void>({
      query: () => ({
        url: `/workout/user`,
        method: "POST",
        providesTags: ["Workout"],
      }),
    }),
  }),
});

export const {
  useVerifyPaymentQuery,
  useGetClientSecretMutation,
  useGetGymPlansQuery,
  useGetGymPlanByIdQuery,
  useUserRegistrationMutation,
  useUserLoginMutation,
  useUserLogoutMutation,
  useUserProfileQuery,
  useUserChangePasswordMutation,
  useUserCheckUniqueMutation,
  useGetUserPaymentsMutation,
  useChangeUserDetailsMutation,
  //CATEGORY BLOG
  useGetAllBlogCategoriesQuery,
  //BLOG
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogByCategoryRelatedQuery,
  //User signature
  useGetUserSignatureMutation,
  //Class Types
  useGetAllClassTypesQuery,

  //Signature
  useChangeUserSignatureGymPlanMutation,

  //Classes
  useGetAllClassesQuery,

  //Equipment
  useGetCardioEquipmentQuery,
  useGetStrengthEquipmentQuery,
  useGetFunctionalEquipmentQuery,

  // Exercises
  useGetAllExercisesQuery,

  // Workouts
  useGetUserWorkoutMutation,
} = api;
