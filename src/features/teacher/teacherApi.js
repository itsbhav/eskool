import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const teachersAdapter = createEntityAdapter({
  //   sortComparer: (a, b) => (a.timestamp < b.timestamp ? 1 : -1),
});

const initialState = teachersAdapter.getInitialState();

export const teachersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET YOURSELF
    getTeacher: builder.query({
      query: () => ({
        url: `/teacher`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedTeachers = responseData.map((teacher) => {
          return teacher;
        });
        return teachersAdapter.setAll(initialState, loadedTeachers);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Teacher", id: "LIST" }, // Invalidate the list
            ...result.map((teacher) => ({
              type: "Teacher",
              id: teacher.id,
            })),
          ];
        } else {
          return [{ type: "Teacher", id: "LIST" }];
        }
      },
    }),

    //   CREATE TEACHER
    addNewTeacher: builder.mutation({
      query: (initialTeacher) => {
        return {
          url: "/teacher",
          method: "POST",
          body: initialTeacher,
        };
      },
      invalidatesTags: [{ type: "Teacher", id: "LIST" }],
    }),

    getCoursesByYou: builder.query({
      query: () => ({
        url: "/teacher/course",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedCourses = responseData.map((course) => {
          return course;
        });
        return teachersAdapter.setAll(initialState, loadedCourses);
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

    // GET LECTURES BY COURSE
    getLecturesByCourse: builder.query({
      query: (course_id) => ({
        url: `/teacher/lecture?course_id=${course_id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedLectures = responseData.map((course) => {
          return course;
        });
        return teachersAdapter.setAll(initialState, loadedLectures);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Lecture", id: "LIST" }, // Invalidate the list
            ...result.map((course) => ({
              type: "Lecture",
              id: course.id,
            })),
          ];
        } else {
          return [{ type: "Lecture", id: "LIST" }];
        }
      },
    }),
    // ADD LECTURE
    addLecture: builder.mutation({
      query: (initial) => {
        return {
          url: "/teacher/lecture",
          method: "POST",
          body: initial,
        };
      },
      invalidatesTags: [{ type: "Lecture", id: "LIST" }],
    }),
    // ADD TO PLAYLIST
    addToPlaylist: builder.mutation({
      query: (initial) => {
        return {
          url: "/teacher/addtoplay",
          method: "POST",
          body: initial,
        };
      },
    }),
    uploadVideo: builder.mutation({
      query: () => {
        return {
          url: "/teacher/upload",
          method: "POST",
        };
      },
    }),
    getAssignmentByCourseTeacher: builder.query({
      query: (course_id) => ({
        url: `/teacher/assignment?course_id=${course_id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedTeachers = responseData.map((teacher) => {
          return teacher;
        });
        return teachersAdapter.setAll(initialState, loadedTeachers);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Assignment", id: "LIST" }, // Invalidate the list
            ...result.map((ass) => ({
              type: "Assignment",
              id: ass.id,
            })),
          ];
        } else {
          return [{ type: "Assignment", id: "LIST" }];
        }
      },
    }),
    addYTCred: builder.query({
      query: () => ({
        url: `/oauth`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
    addAssignment: builder.mutation({
      query: (ass) => {
        // console.log(ass)
        return {
          url: "/teacher/assignment",
          method: "POST",
          body: ass,
        };
      },
      invalidatesTags: [{ type: "Assignment", id: "LIST" }],
    }),
    deleteAssignment: builder.mutation({
      query: ({ id }) => ({
        url: `/teacher/assignment`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Assignment", id: arg.id },
      ],
    }),
    getStudentsByCourse: builder.query({
      query: (course_id) => ({
        url: `/teacher/student?course_id=${course_id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedTeachers = responseData.map((teacher) => {
          return teacher;
        });
        return teachersAdapter.setAll(initialState, loadedTeachers);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "User", id: "LIST" }, // Invalidate the list
            ...result.map((ass) => ({
              type: "User",
              id: ass.id,
            })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
  }),
});

export const {
  useGetTeacherQuery,
  useAddNewTeacherMutation,
  useGetCoursesByYouQuery,
  useGetLecturesByCourseQuery,
  useAddLectureMutation,
  useAddToPlaylistMutation,
  useUploadVideoMutation,
  useGetAssignmentByCourseTeacherQuery,
  useAddAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetStudentsByCourseQuery,
  useAddYTCredQuery,
} = teachersApiSlice;

// returns the query result object
// export const selectTeachersResult =
//   teachersApiSlice.endpoints.getAllTeachers.select();

// // creates memoized selector
// const selectTeachersData = createSelector(
//   selectTeachersResult,
//   (teachersResult) => teachersResult.data // normalized state object with ids & entities
// );

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//   selectAll: selectAllTeachers,
//   selectById: selectTeacherById,
//   selectIds: selectTeacherIds,
//   // Pass in a selector that returns the teachers slice of state
// } = teachersAdapter.getSelectors(
//   (state) => selectTeachersData(state) ?? initialState
// );
