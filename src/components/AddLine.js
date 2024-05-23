import React from 'react'
import { Link } from 'react-router-dom';
import { useGetAllAdvertisementsQuery } from '../features/advertisements/advertisementApi'
const AddLine = ({ id }) => {
    
    const { advertisement} = useGetAllAdvertisementsQuery("advertisementList", {
    selectFromResult: ({ data }) => ({
      advertisement:data?.entities[id] ?? "Not Found"
    }),
    });
  return (
      <tr>
          <td><Link to={advertisement.url} target='blank'>{advertisement.subject}</Link></td>
          <td>{ (new Date(advertisement.timestamp)).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})}</td>
      </tr>
  )
}

export default AddLine