import React from "react";
import Highcharts from "highcharts/";
import HighchartsReact from "highcharts-react-official";
import networkgraph from "highcharts/modules/networkgraph";


function LinkTree(props) {

  Highcharts.addEvent(
    Highcharts.Series, 
    'click',
    function(e){
      props.searchMsisdn(e.point.id);
    }
  )

  Highcharts.addEvent(
    Highcharts.Series,
    'afterSetOptions',
    function (e) {
        var colors = Highcharts.getOptions().colors,
        i = 1,
        nodes = {};

        let mainMsisdn = props.mainMsisdn;
        let msisdnList = Object.keys(props.data);
        //console.log("prop",props)
        if (
            this instanceof Highcharts.seriesTypes.networkgraph &&
            e.options.id === 'caller-data'
        ) {
            e.options.data.forEach(function (link) {
              if(link[0] === mainMsisdn){
                nodes[mainMsisdn] = {
                  id: mainMsisdn,
                  marker: {
                      radius: 25
                  }
                };
                
                if(msisdnList.includes(link[1].toString())){
                  nodes[link[1]] = {
                      id: link[1],
                      marker: {
                          radius: 25
                      },
                      color: colors[i++]
                  };
                }
              }else if (nodes[link[0]] && nodes[link[0]].color) {
                nodes[link[1]] = {
                  id: link[1],
                  color: nodes[link[0]].color,
                  marker: {
                    radius: 25
                  },
                };
              }
            });

            e.options.nodes = Object.keys(nodes).map(function (id) {
              return nodes[id];
            });
        }
    }
);

  networkgraph(Highcharts);
  //console.log(props.data)
  let data=[];
  for(let servedmsisdn in props.data){
    props.data[servedmsisdn].forEach(callednumber => {
      data.push([servedmsisdn, callednumber])
    }); 
  }
 //console.log(data);

 let data1=[];
  for(let x in data){
    data[x].forEach(y => {
      data1.push(y)
    }); 
  }
 //console.log('1',data1);

 const getMostCommon = arr => {
  const count = {};
  
  arr.forEach(el => {
    if(el in count){
      count[el] +=1;
    }
    else{
      count[el] =1;
    }
     //count[el] = (count[el] || 0) + 1;
  });
  
  return count;
}
let a = getMostCommon(data1);
//console.log('a',a);
let data2 = [];

for(let servedmsisdn in props.data){
  props.data[servedmsisdn].forEach(callednumber => {
    data2.push([servedmsisdn, callednumber,a[callednumber]])
  }); 
}
//console.log('2',data2);

  const options = {
    chart: {
      type: "networkgraph",
      height: "100%",
    },
    title: {
      text: "Link-Tree Chart To represent caller data",
    },
    subtitle: {
      text: Object.keys(props.data).length? "" : 'No Data Found',
    },
    series: [
      {
        marker: {
          radius: 25,
          width: 8,
        },
        hover:{
          lineWidthPlus:data[0]+10,
        },
        link: {
          width: 5,
      },
        dataLabels: {
          enabled: true,
          linkFormat: "",
        },
        id: "caller-data",
        data,
        //layoutAlgorithm: {
         // enableSimulation: true,
       //   friction: -0.9
     // },
        
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default LinkTree;
