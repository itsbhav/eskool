import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
// import {createFormDataFromObject} from '@redux-simple/toolkit'
import { apiSlice } from "../../app/api/apiSlice";

const advertisementsAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.timestamp < b.timestamp ? 1 : -1),
});

const initialState = advertisementsAdapter.getInitialState();

export const advertisementsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdvertisements: builder.query({
      query: () => ({
        url: "/advertisements/get",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedAdvertisements = responseData.map((advertisement) => {
          // advertisement.id = advertisement.id;
          // console.log(advertisement)
          return advertisement;
        });
        return advertisementsAdapter.setAll(initialState, loadedAdvertisements);
      },
      providesTags: (result, error, arg) => {
        if (result?.length) {
          return [
            { type: "Advertisement", id: "LIST" }, // Invalidate the list
            ...result.map((advertisement) => ({
              type: "Advertisement",
              id: advertisement.id,
            })),
          ];
        } else {
          return [{ type: "Advertisement", id: "LIST" }];
        }
      },
    }),
    addNewAdvertisement: builder.mutation({
      query: (initialAdvertisement) => {
        // console.log("hii")
        // const body = createFormDataFromObject(initialAdvertisement);
        return {
          url: "/advertisements",
          method: "POST",
          body:initialAdvertisement
        }
        
      },
      invalidatesTags: [{ type: "Advertisement", id: "LIST" }],
    }),
    deleteAdvertisement: builder.mutation({
      query: ({ id }) => ({
        url: `/advertisements`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Advertisement", id: arg.id }],
    }),
  }),
});

export const {
  useAddNewAdvertisementMutation,
  useDeleteAdvertisementMutation,
  useGetAllAdvertisementsQuery,
} = advertisementsApiSlice;

// returns the query result object
export const selectAdvertismentsResult =
  advertisementsApiSlice.endpoints.getAllAdvertisements.select();

// creates memoized selector
const selectAdvertisementsData = createSelector(
  selectAdvertismentsResult,
  (advertisementsResult) => advertisementsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllAdvertisements,
  selectById: selectAdvertisementById,
  selectIds: selectAdvertisementIds,
  // Pass in a selector that returns the advertisments slice of state
} = advertisementsAdapter.getSelectors(
  (state) => selectAdvertisementsData(state) ?? initialState
);
