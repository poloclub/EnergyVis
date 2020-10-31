
/*global d3*/

import React from 'react';
import {Line} from 'react-chartjs-2';


var tmp_data = {"dram":
[13357.0,48647130.0,98513380.0,147513390.0,198339530.0,246772798.0,
  295826663.0,345591749.0,395222700.0,444668628.0,494333820.0,
  543387579.0,593710135.0,643508636.0,695536087.0,745058148.0,
  793835038.0,843442672.0,892927553.0,943286142.0,996514199.0,
  1045655535.0,1096279532.0,1146858991.0,1196738950.0,
  1247097278.0,1296914231.0,1345994550.0,1394935303.0,
  1444111875.0,1492821215.0,1540980121.0,1591032924.0,
  1640050819.0,1688678947.0,1738391860.0,1787138318.0,
  1828553842.0,1877204155.0,1925656042.0,1974891901.0,
  2028752537.0,2076383609.0,2124725948.0,2172771100.0,
  2221088867.0,2268666620.0,2318613821.0,2367743483.0,
  2416921631.0
],
"pkg":[106629.0,491086206.0,985767557.0,
  1478018983.0,1976190559.0,2463663798.0,
  2956830626.0,3451994886.0,3945734345.0,
  4437067499.0,4928525225.0,5420191508.0,
  5913200377.0,6403029201.0,6956197219.0,
  7446334393.0,7936324715.0,8425039101.0,
  8913978279.0,9403679906.0,9906680327.0,
  10395107727.0,10889374772.0,11381079202.0,
  11872504152.0,12364657251.0,12856865707.0,
  13346844861.0,13837957373.0,14332499381.0,
  14825563182.0,15308163448.0,15802409558.0,
  16294686130.0,16783718813.0,17276120202.0,
  17767557298.0,18174268232.0,18658379175.0,
  19147693841.0,19640366774.0,20193354006.0,
  20680091652.0,21167607249.0,21655668317.0,
  22144356274.0,22631153185.0,23127473203.0,
  23622869824.0,24115509248.0]
}

var human = []
for (var i = 0; i < tmp_data["pkg"].length; i++){
  tmp_data["pkg"][i] /= 1000000000
  tmp_data["dram"][i] /= 1000000000
  human.push(i * .4)
}

const labelGenerator = (length) => {
  const arr = []
  for (var i = 0; i < length; i++) {
    arr.push(i * 4)
  }
  return arr;
}

const data = {
  labels: labelGenerator(tmp_data["dram"].length),
  datasets: [
    {
      label: 'CPU Consumption',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: tmp_data["pkg"]
    },
    {
      label: 'RAM Consumption',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(255, 153, 0, 0.4)',
      borderColor: 'rgba(255, 153, 0, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(255, 153, 0, 1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(255, 153, 0, 1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: tmp_data["dram"]
    },
    {
      label: 'Human',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(68, 50, 168, 0.4)',
      borderColor: 'rgba(68, 50, 168, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(68, 50, 168, 1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(68, 50, 168, 1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: human
    }
  ]
};

// const data = {
//   labels: [0, 1, 2, 3, 4, 5, 6],
//   datasets: [
//     {
//       label: 'Carbon Consumption',
//       fill: false,
//       lineTension: 0.1,
//       backgroundColor: 'rgba(75,192,192,0.4)',
//       borderColor: 'rgba(75,192,192,1)',
//       borderCapStyle: 'butt',
//       borderDash: [],
//       borderDashOffset: 0.0,
//       borderJoinStyle: 'miter',
//       pointBorderColor: 'rgba(75,192,192,1)',
//       pointBackgroundColor: '#fff',
//       pointBorderWidth: 1,
//       pointHoverRadius: 5,
//       pointHoverBackgroundColor: 'rgba(75,192,192,1)',
//       pointHoverBorderColor: 'rgba(220,220,220,1)',
//       pointHoverBorderWidth: 2,
//       pointRadius: 1,
//       pointHitRadius: 10,
//       data: [65, 59, 80, 81, 56, 55, 40]
//     },
//     {
//         label: 'FLOPs',
//         fill: false,
//         lineTension: 0.1,
//         backgroundColor: 'rgba(255, 153, 0, 0.4)',
//         borderColor: 'rgba(255, 153, 0, 1)',
//         borderCapStyle: 'butt',
//         borderDash: [],
//         borderDashOffset: 0.0,
//         borderJoinStyle: 'miter',
//         pointBorderColor: 'rgba(255, 153, 0, 1)',
//         pointBackgroundColor: '#fff',
//         pointBorderWidth: 1,
//         pointHoverRadius: 5,
//         pointHoverBackgroundColor: 'rgba(255, 153, 0, 1)',
//         pointHoverBorderColor: 'rgba(220,220,220,1)',
//         pointHoverBorderWidth: 2,
//         pointRadius: 1,
//         pointHitRadius: 10,
//         data: [40, 32, 45, 91, 24, 55, 11]
//       }
//   ]
// };

class SampleGraph extends React.Component {

  render() {
    return (
      <div style={{marginLeft: '2.5%', marginRight: '2.5%'}}>
        <Line data={data} />
      </div>
    );
  }

}


export default SampleGraph

