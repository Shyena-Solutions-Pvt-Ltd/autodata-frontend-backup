import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";
import timeline from "highcharts/modules/timeline";

function HandsetHistoryGraph1(props) {
  timeline(Highcharts);


  let data = props.data.map((res) => {
    console.log(res.msisdn);
         
    let startTime = new Date(res.startTime);
    let endTime = new Date(res.endTime);
    let sDate = startTime.getDate()+'/'+startTime.getMonth()+'/'+startTime.getFullYear();
    let endDate = endTime.getDate()+'/'+endTime.getMonth()+'/'+endTime.getFullYear();
    
    return {
      name: `Start Time: ${sDate} End Time: ${endDate}`,
      label: `IMEI: ${res.imei}  MSISDN: ${res.msisdn}`,
      
    };
    
    
  });
  
  
  const options = {
    chart: {
      type: "timeline",
    },
    accessibility: {
      screenReaderSection: {
        beforeChartFormat:
          "<h5>{chartTitle}</h5>" +
          "<div>{typeDescription}</div>" +
          "<div>{chartSubtitle}</div>" +
          "<div>{chartLongdesc}</div>" +
          "<div>{viewTableButton}</div>",
      },
      point: {
        valueDescriptionFormat: "{index}. {point.label}. {point.description}.",
      },
    },
    xAxis: {
      title: "Date-Time",
      visible: true,
    },
    yAxis: {
      title: "IMEI / MSISDN",
      visible: true,
    },
    title: {
      text: "Handset History",
    },
    subtitle: {
      text: "",
    },
    colors: ["#4185F3", "#427CDD", "#406AB2", "#3E5A8E", "#3B4A68", "#363C46"],
    series: [
      {
        data,
      },
      
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default HandsetHistoryGraph1;
