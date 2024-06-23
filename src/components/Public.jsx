import React from "react";
import { useGetAllAdvertisementsQuery } from "../features/advertisements/advertisementApi";
import { useGetAllNoticesQuery } from "../features/notices/noticeApi";
import { PulseLoader } from "react-spinners";
import { memo } from "react";
import AddLine from "../features/advertisements/AddLine";
import NoticeLine from "../features/notices/NoticeLine";
import useShuffle from "../hooks/useShuffle";
import useTitle from "../hooks/useTitle";

const Public = () => {
  useTitle("Public Page");
  const [addPage, setAddPage] = useShuffle("advertisePage");
  const [notePage, setNotePage] = useShuffle("notePage");
  const {
    data: advertisements,
    isSuccess: isAddSuccess,
    isError: isAddError,
    isLoading: isAddLoading,
    error: addError,
  } = useGetAllAdvertisementsQuery(addPage, {});
  const {
    data: notices,
    isSuccess: isNoticeSuccess,
    isError: isNoticeError,
    isLoading: isNoticeLoading,
    error: noticeError,
  } = useGetAllNoticesQuery(notePage, {});
  let content = null;
  let addContent = null;
  let noteContent = null;
  if (isAddSuccess) {
    const { ids } = advertisements;
    if (ids.length === 0)
      addContent = <tr className="table__row">No Advertisements Available</tr>;
    else
      addContent = ids.map((id) => (
        <AddLine key={id} id={id} pageNum={addPage} />
      ));
  }
  if (isNoticeSuccess) {
    const { ids } = notices;
    if (ids.length === 0)
      noteContent = <tr className="table__row">No Notices Available</tr>;
    else
      noteContent = ids.map((id) => (
        <NoticeLine key={id} id={id} pageNum={notePage} />
      ));
  }
  const handleAddInc = () => {
    setAddPage(addPage + 1);
  };
  const handleNoteInc = () => {
    setNotePage(notePage + 1);
  };
  const handleAddDec = () => {
    if (addPage > 1) setAddPage(addPage - 1);
  };
  const handleNoteDec = () => {
    if (notePage > 1) setNotePage(notePage - 1);
  };
  content = (
    <>
      <article className="public">
        <div className="public-box">
          <h2>Important Announcements</h2>
          <div className="public-section-box">
            <section className="public-section">
              <h3>Notices</h3>
              {isNoticeSuccess && (
                <>
                  <table className="table">
                    <thead className="table__thead">
                      <tr>
                        <th scope="col" className="table__th">
                          Timestamp
                        </th>
                        <th scope="col" className="table__th">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>{noteContent}</tbody>
                  </table>
                  <div>
                    <button className="button" onClick={handleNoteDec}>
                      {"<"}
                    </button>
                    <button className="button" onClick={handleNoteInc}>
                      {">"}
                    </button>
                  </div>
                </>
              )}
              {isNoticeLoading && <PulseLoader color="#000" />}
              {isNoticeError && (
                <div className="errmsg">
                  {noticeError?.data?.message || "Error"}
                </div>
              )}
            </section>
            <section className="public-section">
              <h3>Advertisements</h3>
              {isAddSuccess && (
                <>
                  <table className="table">
                    <thead className="table__thead">
                      <tr>
                        <th scope="col" className="table__th">
                          Timestamp
                        </th>
                        <th scope="col" className="table__th">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>{addContent}</tbody>
                  </table>
                  <div>
                    <button className="button" onClick={handleAddDec}>
                      {"<"}
                    </button>
                    <button className="button" onClick={handleAddInc}>
                      {">"}
                    </button>
                  </div>
                </>
              )}
              {isAddLoading && <PulseLoader color="#000" />}
              {isAddError && (
                <div className="errmsg">
                  {addError?.data?.message || "Error"}
                </div>
              )}
            </section>
          </div>
        </div>
      </article>
    </>
  );
  return content;
};

export default memo(Public);
