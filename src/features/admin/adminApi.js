import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const adminsAdapter = createEntityAdapter({
  //   sortComparer: (a, b) => (a.timestamp < b.timestamp ? 1 : -1),
});

const initialState = adminsAdapter.getInitialState();

export const adminsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClass: builder.query({
      query: () => ({
        url: `/admin/class`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedClass = responseData.map((clas) => {
          return clas;
        });
        return adminsAdapter.setAll(initialState, loadedClass);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Class", id: "LIST" }, // Invalidate the list
            ...result.map((clas) => ({
              type: "Class",
              id: clas.id,
            })),
          ];
        } else {
          return [{ type: "Class", id: "LIST" }];
        }
      },
    }),

    addClass: builder.mutation({
      query: (initialClass) => {
        return {
          url: "/admin/class",
          method: "POST",
          body: initialClass,
        };
      },
      invalidatesTags: [{ type: "Class", id: "LIST" }],
    }),

    getAllCourses: builder.query({
      query: () => ({
        url: `/admin/course`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedCourses = responseData.map((course) => {
          return course;
        });
        return adminsAdapter.setAll(initialState, loadedCourses);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Course", id: "LIST" }, // Invalidate the list
            ...result.map((course) => ({
              type: "Course",
              id: course.id,
            })),
          ];
        } else {
          return [{ type: "Course", id: "LIST" }];
        }
      },
    }),
    addCourse: builder.mutation({
      query: (initialCourse) => {
        return {
          url: "/admin/course",
          method: "POST",
          body: initialCourse,
        };
      },
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),

    addClassCourseMap: builder.mutation({
      query: (initialCourse) => {
        return {
          url: "/admin/course/coursemap",
          method: "POST",
          body: initialCourse,
        };
      },
      invalidatesTags: [{ type: "CourseMap", id: "LIST" }],
    }),

    removeClassCourseMap: builder.mutation({
      query: (initialCourse) => {
        return {
          url: "/admin/course/coursemap",
          method: "DELETE",
          body: initialCourse,
        };
      },
      invalidatesTags: [{ type: "CourseMap", id: "LIST" }],
    }),

    getAllFee: builder.query({
      query: () => ({
        url: `/admin/fee`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedAdmins = responseData.map((admin) => {
          return admin;
        });
        return adminsAdapter.setAll(initialState, loadedAdmins);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Fee", id: "LIST" }, // Invalidate the list
            ...result.map((admin) => ({
              type: "Fee",
              id: admin.id,
            })),
          ];
        } else {
          return [{ type: "Fee", id: "LIST" }];
        }
      },
    }),

    addFeeByClass: builder.mutation({
      query: (initialCourse) => {
        return {
          url: "/admin/fee",
          method: "POST",
          body: initialCourse,
        };
      },
      invalidatesTags: [{ type: "Fee", id: "LIST" }],
    }),

    markFee: builder.mutation({
      query: (initialCourse) => {
        return {
          url: "/admin/fee/mark",
          method: "PUT",
          body: initialCourse,
        };
      },
      invalidatesTags: [{ type: "Fee", id: "LIST" }],
    }),

    getTeachers: builder.query({
      query: () => ({
        url: `/admin/teacher`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedAdmins = responseData.map((admin) => {
          return admin;
        });
        return adminsAdapter.setAll(initialState, loadedAdmins);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Teacher", id: "LIST" }, // Invalidate the list
            ...result.map((admin) => ({
              type: "Teacher",
              id: admin.id,
            })),
          ];
        } else {
          return [{ type: "Teacher", id: "LIST" }];
        }
      },
    }),

    confirmedByTeacher: builder.mutation({
      query: (initialCourse) => {
        return {
          url: "/admin/teacher/verifiedByAdmin",
          method: "PUT",
          body: initialCourse,
        };
      },
      invalidatesTags: [{ type: "Teacher", id: "LIST" }],
    }),

    verifiedByTeacher: builder.mutation({
      query: (initialCourse) => {
        return {
          url: "/admin/teacher/verifiedByTeacher",
          method: "PUT",
          body: initialCourse,
        };
      },
      invalidatesTags: [{ type: "Teacher", id: "LIST" }],
    }),

    getStudents: builder.query({
      query: () => ({
        url: `/admin/user`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedAdmins = responseData.map((admin) => {
          return admin;
        });
        return adminsAdapter.setAll(initialState, loadedAdmins);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "User", id: "LIST" }, // Invalidate the list
            ...result.map((admin) => ({
              type: "User",
              id: admin.id,
            })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),

    addMarks: builder.mutation({
      query: (initialCourse) => {
        return {
          url: "/admin/marks",
          method: "POST",
          body: initialCourse,
        };
      },
      invalidatesTags: [{ type: "Mark", id: "LIST" }],
    }),

    modifyMarks: builder.mutation({
      query: (initialCourse) => {
        return {
          url: "/admin/marks",
          method: "PUT",
          body: initialCourse,
        };
      },
      invalidatesTags: [{ type: "Mark", id: "LIST" }],
    }),

    deleteMarks: builder.mutation({
      query: (initialCourse) => {
        return {
          url: "/admin/marks",
          method: "DELETE",
          body: initialCourse,
        };
      },
      invalidatesTags: [{ type: "Mark", id: "LIST" }],
    }),
  }),
});

export const {
  useAddClassCourseMapMutation,
  useAddClassMutation,
  useAddCourseMutation,
  useAddFeeByClassMutation,
  useAddMarksMutation,
  useConfirmedByTeacherMutation,
  useDeleteMarksMutation,
  useGetAllCoursesQuery,
  useGetAllFeeQuery,
  useGetClassQuery,
  useGetStudentsQuery,
  useGetTeachersQuery,
  useRemoveClassCourseMapMutation,
  useVerifiedByTeacherMutation,
  useMarkFeeMutation,
  useModifyMarksMutation,
} = adminsApiSlice;

// returns the query result object
// export const selectAdminsResult =
//   adminsApiSlice.endpoints.getAllAdmins.select();

// creates memoized selector
// const selectAdminsData = createSelector(
//   selectAdminsResult,
//   (adminsResult) => adminsResult.data // normalized state object with ids & entities
// );

//getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//   selectAll: selectAllAdmins,
//   selectById: selectAdminById,
//   selectIds: selectAdminIds,
//   // Pass in a selector that returns the admins slice of state
// } = adminsAdapter.getSelectors(
//   (state) => selectAdminsData(state) ?? initialState
// );
