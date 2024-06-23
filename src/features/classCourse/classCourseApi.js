import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const classCoursesAdapter = createEntityAdapter({
  // sortComparer: (a, b) => (a.timestamp < b.timestamp ? 1 : -1),
});

const initialState = classCoursesAdapter.getInitialState();

export const classCoursesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllClass: builder.query({
      query: () => ({
        url: `/public/class`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedClassCourses = responseData.map((classCourse) => {
          return classCourse;
        });
        return classCoursesAdapter.setAll(initialState, loadedClassCourses);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Class", id: "LIST" }, // Invalidate the list
            ...result.map((classCourse) => ({
              type: "Class",
              id: classCourse.id,
            })),
          ];
        } else {
          return [{ type: "Class", id: "LIST" }];
        }
      },
    }),

    getAllCourses: builder.query({
      query: () => ({
        url: `/public/course`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedClassCourses = responseData.map((classCourse) => {
          return classCourse;
        });
        return classCoursesAdapter.setAll(initialState, loadedClassCourses);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Course", id: "LIST" }, // Invalidate the list
            ...result.map((classCourse) => ({
              type: "Course",
              id: classCourse.id,
            })),
          ];
        } else {
          return [{ type: "Course", id: "LIST" }];
        }
      },
    }),
  }),
});

export const { useGetAllClassQuery, useGetAllCoursesQuery } =
  classCoursesApiSlice;

// returns the query result object
// export const selectClassCoursesResult =
// classCoursesApiSlice.endpoints.getAllClassCourses.select();

// creates memoized selector
// const selectClassCoursesData = createSelector(
//   selectClassCoursesResult,
//   (classCoursesResult) => classCoursesResult.data // normalized state object with ids & entities
// );

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//   selectAll: selectAllClassCourses,
//   selectById: selectClassCourseById,
//   selectIds: selectClassCourseIds,
//   // Pass in a selector that returns the classCourses slice of state
// } = classCoursesAdapter.getSelectors(
//   (state) => selectClassCoursesData(state) ?? initialState
// );
