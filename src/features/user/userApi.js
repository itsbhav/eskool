import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const studentsAdapter = createEntityAdapter({
  //   sortComparer: (a, b) => (a.timestamp < b.timestamp ? 1 : -1),
});

const initialState = studentsAdapter.getInitialState();

export const studentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudent: builder.query({
      query: () => ({
        url: `/student`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedStudents = responseData.map((student) => {
          return student;
        });
        return studentsAdapter.setAll(initialState, loadedStudents);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "User", id: "LIST" }, // Invalidate the list
            ...result.map((student) => ({
              type: "User",
              id: student.id,
            })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),

    addNewStudent: builder.mutation({
      query: (initialStudent) => {
        return {
          url: "/student",
          method: "POST",
          body: initialStudent,
        };
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    getClass: builder.query({
      query: () => ({
        url: `/student/class`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedStudents = responseData.map((student) => {
          return student;
        });
        return studentsAdapter.setAll(initialState, loadedStudents);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Class", id: "LIST" }, // Invalidate the list
            ...result.map((student) => ({
              type: "Class",
              id: student.id,
            })),
          ];
        } else {
          return [{ type: "Class", id: "LIST" }];
        }
      },
    }),

    getEnrolledCourses: builder.query({
      query: () => ({
        url: `/student/course`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedStudents = responseData.map((student) => {
          return student;
        });
        return studentsAdapter.setAll(initialState, loadedStudents);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Course", id: "LIST" }, // Invalidate the list
            ...result.map((student) => ({
              type: "Course",
              id: student.id,
            })),
          ];
        } else {
          return [{ type: "Course", id: "LIST" }];
        }
      },
    }),
    addCourseAsMinor: builder.mutation({
      query: (initialStudent) => {
        return {
          url: "/student/course",
          method: "POST",
          body: initialStudent,
        };
      },
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),
    getYourFee: builder.query({
      query: () => ({
        url: `/student/fee`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedStudents = responseData.map((student) => {
          return student;
        });
        return studentsAdapter.setAll(initialState, loadedStudents);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Fee", id: "LIST" }, // Invalidate the list
            ...result.map((student) => ({
              type: "Fee",
              id: student.id,
            })),
          ];
        } else {
          return [{ type: "Fee", id: "LIST" }];
        }
      },
    }),
    getYourMarks: builder.query({
      query: () => ({
        url: `/student/mark`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedStudents = responseData.map((student) => {
          student.id = student.course_id;
          return student;
        });
        return studentsAdapter.setAll(initialState, loadedStudents);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Mark", id: "LIST" }, // Invalidate the list
            ...result.map((student) => ({
              type: "Mark",
              id: student.id,
            })),
          ];
        } else {
          return [{ type: "Mark", id: "LIST" }];
        }
      },
    }),
    getLectureByCourseStudent: builder.query({
      query: (id) => ({
        url: `/student/lecture?course_id=${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedStudents = responseData.map((student) => {
          return student;
        });
        return studentsAdapter.setAll(initialState, loadedStudents);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Lecture", id: "LIST" }, // Invalidate the list
            ...result.map((student) => ({
              type: "Lecture",
              id: student.id,
            })),
          ];
        } else {
          return [{ type: "Lecture", id: "LIST" }];
        }
      },
    }),
    getAssignmentsByCourse: builder.query({
      query: (id) => ({
        url: `/student/assignment?course_id=${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedStudents = responseData.map((student) => {
          return student;
        });
        return studentsAdapter.setAll(initialState, loadedStudents);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Assignment", id: "LIST" }, // Invalidate the list
            ...result.map((student) => ({
              type: "Assignment",
              id: student.id,
            })),
          ];
        } else {
          return [{ type: "Assignment", id: "LIST" }];
        }
      },
    }),
  }),
});

export const {
  useAddCourseAsMinorMutation,
  useAddNewStudentMutation,
  useGetAssignmentsByCourseQuery,
  useGetClassQuery,
  useGetEnrolledCoursesQuery,
  useGetLectureByCourseStudentQuery,
  useGetStudentQuery,
  useGetYourFeeQuery,
  useGetYourMarksQuery,
} = studentsApiSlice;

// returns the query result object
// export const selectStudentsResult =
//   studentsApiSlice.endpoints.getAllStudents.select();

// creates memoized selector
// const selectStudentsData = createSelector(
//   selectStudentsResult,
//   (studentsResult) => studentsResult.data // normalized state object with ids & entities
// );

//getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//   selectAll: selectAllStudents,
//   selectById: selectStudentById,
//   selectIds: selectStudentIds,
//   // Pass in a selector that returns the students slice of state
// } = studentsAdapter.getSelectors(
//   (state) => selectStudentsData(state) ?? initialState
// );
