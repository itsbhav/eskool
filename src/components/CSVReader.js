import React, { useState } from "react";
import Papa from "papaparse";

const CSVReader = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    Papa.parse(event.target.files[0], {
      complete: function (results) {
        var data1 = results.data;
        var x = [];
        for (var i = 1; i < data1.length; i++) {
          var dict = {};
          for (var j = 0; j < data1[0].length; j++) {
            dict[data1[0][j]] = data1[i][j];
          }
          x.push(dict);
        }
        console.log(x);
        setData(x);
      },
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
};

export default CSVReader;
