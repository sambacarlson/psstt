import { Heading, VStack, Button, HStack, Text, Box, Center } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import AnalyticsComponent from "../components/chart/Analytics";
import Analytics360TagTable from "@components/chart/Analytics360TagTable";
import { highChartsTheme, to_YY_MM_DD } from "lib/util";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

// https://stackoverflow.com/questions/11396628/highcharts-datetime-axis-how-to-disable-time-part-show-only-dates
// https://www.highcharts.com/forum/viewtopic.php?t=42696
// Highcharts.theme = highChartsTheme;
// if (typeof Highcharts === "object") Highcharts.setOptions(Highcharts.theme);

// const createCategoriesSpline = (data) => {
//   return (
//     data?.timeSeries.map((timer) => new Date(timer.timeStamp).toDateString()) ||
//     []
//   );
// };

// const createCategoriesColumn = (data) => {
//   return data?.tags || [];
// };

// const createDataSpline = (data) => {
//   return (
//     data?.tags.map((tag) => {
//       return {
//         name: tag,
//         marker: {
//           symbol: "square",
//         },
//         data: data.timeSeries.map((timer) => {
//           if (timer[tag] >= 5)
//             return {
//               y: timer[tag],
//               marker: {
//                 symbol:
//                   "url(https://www.highcharts.com/samples/graphics/sun.png)",
//               },
//             };
//           return timer[tag];
//         }),
//       };
//     }) || []
//   );
// };

// const createDataColumn = (data) => {
//   const seriesValues =
//     data?.tags.map((tag) => {
//       return data.timeSeries.reduce((total, timer) => total + timer[tag], 0);
//     }) || [];
//   return [
//     {
//       name: "",
//       data: seriesValues,
//     },
//   ];
// };
// const chartOptionsCreator = (
//   data,
//   createCategoriesSpline,
//   createDataSpline,
//   type = "spline",
//   max = 7,
//   title = "Your entire time track",
//   subtitle = "Drag chart to see more :)"
// ) => {
//   const chartOptions = {
//     chart: {
//       height: 300,
//       panning: true,
//       followTouchMove: true,
//       type,
//     },
//     credits: {
//       enabled: false,
//     },
//     title: {
//       text: title,
//     },
//     subtitle: {
//       text: subtitle,
//     },
//     xAxis: {
//       categories: createCategoriesSpline(data),
//       min: 0,
//       max: max,
//     },
//     yAxis: {
//       title: {
//         text: "Hours",
//       },
//       labels: {
//         formatter: function () {
//           return this.value + " hr";
//         },
//       },
//     },
//     tooltip: {
//       crosshairs: true,
//       shared: true,

//       // https://stackoverflow.com/questions/6867607/want-to-sort-highcharts-tooltip-results
//       formatter: function (tooltip) {
//         let items = this.points || splat(this);

//         // sort the values
//         items.sort(function (a, b) {
//           return a.y < b.y ? -1 : a.y > b.y ? 1 : 0;
//         });
//         items.reverse();

//         return tooltip.defaultFormatter.call(this, tooltip);
//       },
//     },
//     plotOptions: {
//       spline: {
//         marker: {
//           radius: 4,
//           lineColor: "#666666",
//           lineWidth: 1,
//         },
//       },
//       // https://www.highcharts.com/forum/viewtopic.php?t=6399
//       // events: {
//       //   show: function () {
//       //     let chart = this.chart,
//       //       series = chart.series,
//       //       i = series.length,
//       //       otherSeries;
//       //     while (i--) {
//       //       otherSeries = series[i];
//       //       if (otherSeries != this && otherSeries.visible) {
//       //         otherSeries.hide();
//       //       }
//       //     }
//       //   },
//       // },
//     },
//     series: createDataSpline(data),
//   };

//   return chartOptions;
// };
export default function Analytics() {
  const [dailyChecks, setDailyChecks] = useState([])
  const [tasksToday, setTasksToday] = useState([])
  //   const [data, setData] = useState(null);
  const router = useRouter()
  const session = useSession()

  // useEffect(() => {
  //   if (!session?.data?.user) {
  //     router.push('/401')
  //   }
  // }, [])
  //   useEffect(() => {
  //     if (!session?.data?.user?.isAdmin) {
  //       router.push('/403')
  //     }
  //   }, [])

  //   useEffect(() => {
  //     axios
  //       .get("/api/analytics-360")
  //       .then((res) => {
  //         setData(res.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         alert(err?.response?.data || "Internal Server Error :)");
  //       });
  //   }, []);

  useEffect(() => {

    const fetchDailyChecks = async () => {
      axios.get(`/api/dailyCheck?date=${to_YY_MM_DD(new Date())}`).then(res => {
        setDailyChecks(res.data)
      })
    }


    fetchDailyChecks()
  }, [])

  useEffect(() => {
    console.log('now getting daily tasks.....')
    const getDailyTasks = async () => {
      dailyChecks.forEach((dialycheck) => {
        console.log('fetching tasks for daily check: ', dialycheck)
        axios.get(`/api/timer?dailyCheckId=${dialycheck._id}`).then(res => {
          console.log('response from daily task: ', res)
          setTasksToday([...tasksToday, { user: dialycheck?.userId?.name, tasks: res.data }])
        })
      })
    }
    getDailyTasks()
  }, [dailyChecks])

  console.log('daily checks: ', dailyChecks)
  console.log('tasks today: ', tasksToday)

  return (
    <>
      {/* <Head>
      <title>@time-stamp - your hand crafter time analysis :)</title>
      <meta
        property={"og:title"}
        content={"@time-stamp - your hand crafter time analysis :)"}
      />
      <meta
        property="og:image"
        content={
          "https://user-images.githubusercontent.com/54087826/145572545-2b84f8a2-9c31-4dfe-bfc8-4a69580336ea.png"
        }
      />
    </Head> */}
      <VStack alignItems="left" rowGap={10} w={'100vw'} h={'100vh'}>
        {/* <Heading textAlign="center">Your time analytics</Heading>
      <AnalyticsComponent {...data} />
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptionsCreator(
          data,
          createCategoriesSpline,
          createDataSpline,
          "spline",
          7
        )}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptionsCreator(
          data,
          createCategoriesColumn,
          createDataColumn,
          "column",
          null,
          "",
          ""
        )}
      />
      <Analytics360TagTable data={data} /> */}
        {
          tasksToday.map((task) => {
            const data = task.tasks.map(el => (
              {
                'Name': el.name,
                'Estimated time': Math.round(el.estimatedTime * 10 / 6) / 100,
                'Actual time': Math.round((el.finishTime - el.startTime) / (100 * 60 * 6)) / 100
              }
            ))

            console.log('graph data: ', data)

            return (
              <VStack mt={20} w={1200} h={500} rowGap={50}>
                <Text>{task.user}</Text>

                <Center width={1200} height={400}>
                  <ResponsiveContainer width={1200} height={300}>
                    <BarChart data={data}>
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

              </VStack>
            )
          })
        }
      </VStack > {" "}
    </>
  );
}
