import React from 'react'
import { Link } from 'react-router-dom';
import { useGetAllNoticesQuery } from '../features/notices/noticeApi'
const NoticeLine = ({ id }) => {
    
    const { notice} = useGetAllNoticesQuery("noticeList", {
    selectFromResult: ({ data }) => ({
      notice:data?.entities[id] ?? "Not Found"
    }),
    });
  return (
      <tr>
      <td><Link to={notice.url} target='blank'>{notice.subject}</Link></td>
      <td>{ notice.timestamp}</td>
      </tr>
  )
}

export default NoticeLine