import React from 'react'
import { useGetAllNoticesQuery } from '../features/notices/noticeApi'
import { useGetAllAdvertisementsQuery } from '../features/advertisements/advertisementApi';
import { PulseLoader } from 'react-spinners';
import NoticeLine from './NoticeLine';
import Notice from './Notice';
import AddLine from './AddLine';
import Upload from './Upload';
import CSVReader from './CSVReader';

const Welcome = () => {
  const {
    data: notices,
    isSuccess,
    isError,
    isLoading,
    error,
  } = useGetAllNoticesQuery("noticeList", {
  });
  const {
    data: advertisements,
    isSuccess:isAddSuccess,
    isError:isAddError,
    isLoading:isAddLoading,
    error:addError,
  } = useGetAllAdvertisementsQuery("advertisementList", {
  });
  let noticeList = null;
  let advertisementList = null;
  if (isError) {
    noticeList = <p>Error Fetching Notices { error?.data?.message||error?.message}</p>
  }
  if (isAddError) {
    advertisementList = <p>Error Fetching Advertisements { addError?.data?.message||addError?.message}</p>
  }
  if (isLoading) {
    noticeList=<PulseLoader color='black'/>
  }
  if (isAddLoading) {
    advertisementList=<PulseLoader color='black'/>
  }
  if (isSuccess) {
    const { ids } = notices
    noticeList = < table >
      <tbody>{ids.map((id) => <NoticeLine key={id} id={id} />)}</tbody>
    </table>
  }
  if (isAddSuccess) {
    const { ids } = advertisements
    advertisementList = < table >
      <tbody>{ids.map((id) => <AddLine key={id} id={id} />)}</tbody>
    </table>
  }
  return (
    <>
      <h1> Welocme!!</h1>
      <>
        <h2>Notices</h2>
        
        {noticeList}
      </>
      <h2>Achievements,Events and Advertisements</h2>
      {advertisementList}
      <Notice />
      <Upload />
      <CSVReader/>
    </>
  )
}

export default Welcome