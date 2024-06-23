import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const noticesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.timestamp < b.timestamp ? 1 : -1),
});

const initialState = noticesAdapter.getInitialState();

export const noticesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotices: builder.query({
      query: (pageNum) => ({
        url: `/public/notice?pageNum=${pageNum}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedNotices = responseData.map((notice) => {
          return notice;
        });
        return noticesAdapter.setAll(initialState, loadedNotices);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Notice", id: "LIST" }, // Invalidate the list
            ...result.map((notice) => ({
              type: "Notice",
              id: notice.id,
            })),
          ];
        } else {
          return [{ type: "Notice", id: "LIST" }];
        }
      },
    }),
    addNewNotice: builder.mutation({
      query: (initialNotice) => {
        return {
          url: "/admin/notices",
          method: "POST",
          body: initialNotice,
        };
      },
      invalidatesTags: [{ type: "Notice", id: "LIST" }],
    }),
    deleteNotice: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/notices`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Notice", id: "LIST" }],
    }),
  }),
});

export const {
  useAddNewNoticeMutation,
  useDeleteNoticeMutation,
  useGetAllNoticesQuery,
} = noticesApiSlice;

// returns the query result object
export const selectNoticesResult =
  noticesApiSlice.endpoints.getAllNotices.select();

// creates memoized selector
const selectNoticesData = createSelector(
  selectNoticesResult,
  (noticesResult) => noticesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotices,
  selectById: selectNoticeById,
  selectIds: selectNoticeIds,
  // Pass in a selector that returns the notices slice of state
} = noticesAdapter.getSelectors(
  (state) => selectNoticesData(state) ?? initialState
);
