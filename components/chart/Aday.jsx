import { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import axios from "axios";
import { highChartsTheme } from "lib/util";
import { useRouter } from "next/router";
import { Center, Text } from "@chakra-ui/react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
Highcharts.theme = highChartsTheme;
if (typeof Highcharts === "object") Highcharts.setOptions(Highcharts.theme);


export default function Today({ date }) {
  const [data, setData] = useState([]);
  const router = useRouter()
  // useEffect(() => {
  //   axios
  //     .get(`/api/timer?date=${date}`)
  //     .then((res) => {
  //       setData(res.data.sort((prev, cur) => cur.time - prev.time));

  //       // if the data is empty and the date is current date, then show alert
  //       if (
  //         res.data.length == 0 &&
  //         new Date(date).toLocaleDateString() != new Date().toLocaleDateString()
  //       )
  //         alert("There is no data on date selected date");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [date]);

  useEffect(() => {
    axios.get('/api/timer').then((res) => setData(res.data))
  }, [router])

  const data1 = [
    { name: 'Geeksforgeeks', students: 400, grade: 300 },
    { name: 'Technical scripter', students: 700, grade: 800 },
    { name: 'Geek-i-knack', students: 200, grade: 300 },
    { name: 'Geek-o-mania', students: 1000, grade: 900 }
  ]

  const data2 = data.map(el => (
    {
      'Name': el.name,
      'Estimated time': Math.round(el.estimatedTime * 10 / 6) / 100,
      'Actual time': Math.round((el.finishTime - el.startTime) / (100 * 60 * 6)) / 100
    }
  ))

  console.log('data from tasks: ', data)
  return (
    <Center width={1200} height={400}>
      <ResponsiveContainer width={1200} height={400}>
        <BarChart data={data2}>
          <Bar dataKey="Estimated time" fill="#FFCF54" barSize={40} />
          <Bar dataKey='Actual time' fill='#5AD8C4' barSize={40} />
          {/* <CartesianGrid stroke="#ccc" /> */}
          <XAxis dataKey="Name" stroke={'white'} />
          <YAxis stroke={'white'} />
          <Tooltip cursor={false} />
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </Center>
  );
}
