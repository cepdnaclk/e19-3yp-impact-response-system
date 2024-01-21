import { useState } from "react";
import Title from "../../Title/Title";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styles from "./PlayerAnalytics.module.scss";
import { MdBarChart } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";
import { data, criticalSessions, data2, criticalSessions2 } from "./playerData";
import { StackedBarChart } from "./StackedBarChart";
import CriticalSession from "./CriticalSession";
import { HistogramData, TimeSpan } from "../../../types";
import ImpactSummaryCard from "../ImpactSummaryCard";
import { useQuery } from "@tanstack/react-query";
import { CriticalSessionType, Metric } from "../../../types";
const PlayerAnalytics = () => {
  const [timeSpan, setTimeSpan] = useState<TimeSpan>("Last Week");

  const sampleObject: HistogramData = {
    left: [10, 30, 50, 70, 90, 110, 130, 150, 170, 190],
    right: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200],
    front: [15, 35, 55, 75, 95, 115, 135, 155, 175, 195],
    back: [25, 45, 65, 85, 105, 125, 145, 165, 185, 205],
  };

  const sampleObject2: HistogramData = {
    left: [5, 12, 8, 20, 15, 25, 18, 30, 22, 10],
    right: [14, 28, 7, 19, 32, 11, 24, 16, 9, 26],
    front: [21, 13, 27, 6, 17, 23, 29, 31, 4, 3],
    back: [2, 1, 34, 36, 33, 37, 38, 39, 40, 42],
  };
  const { data: impactSummaryPlayer } = useQuery({
    queryFn: () => fetchImpactSummaryPlayer(),
    queryKey: ["impactSummaryPlayerData", { timeSpan }],
  });
  const {
    data: metricData,
    // isLoading: isMetricDataLoading,
    // isError: isMetricDataError,
  } = useQuery({
    queryFn: () => fetchMetricData(),
    queryKey: ["metricData", { timeSpan }],
  });

  const {
    data: criticalSessionsData,
    // isLoading: isSessionDataLoading,
    // isError: isSessionDataError,
  } = useQuery({
    queryFn: () => fetchCriticalSessionsData(),
    queryKey: ["sessionData", { timeSpan }],
  });

  async function fetchImpactSummaryPlayer(): Promise<Metric[]> {
    // const response = await fetch("<PLAYER_DATA_API_ENDPOINT_URL>"); // Replace <PLAYER_DATA_API_ENDPOINT_URL> with the actual URL to fetch player data from
    // if (!response.ok) {
    //   throw new Error("Failed to fetch player data");
    // }
    // return response.json();
    if (timeSpan == "Last Week") return data;
    if (timeSpan == "Last Month") return data2;
    else return data;
  }

  async function fetchMetricData(): Promise<HistogramData> {
    // const response = await fetch("<METRIC_DATA_API_ENDPOINT_URL>"); // Replace <METRIC_DATA_API_ENDPOINT_URL> with the actual URL to fetch metric data from
    // if (!response.ok) {
    //   throw new Error("Failed to fetch metric data");
    // }
    // return response.json();
    // return sampleObject;
    if (timeSpan == "Last Week") return sampleObject;
    if (timeSpan == "Last Month") return sampleObject2;
    else return sampleObject;
  }

  async function fetchCriticalSessionsData(): Promise<CriticalSessionType[]> {
    // const response = await fetch("<SESSION_DATA_API_ENDPOINT_URL>"); // Replace <SESSION_DATA_API_ENDPOINT_URL> with the actual URL to fetch session data from
    // if (!response.ok) {
    //   throw new Error("Failed to fetch session data");
    // }
    // return response.json();
    if (timeSpan == "Last Week") return criticalSessions;
    if (timeSpan == "Last Month") return criticalSessions2;
    else return criticalSessions;
  }

  return (
    <main>
      <Title Icon={MdBarChart} title="Player Analytics" />
      <div className={styles.summary}>
        <div className={styles.info}>
          <h2>John Doe's Individual Analytics</h2>{" "}
          <span>0 marked concussion</span>
        </div>
        <div className={styles.controls}>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className={styles.selectTimeSpan}>
                {timeSpan} <FaChevronDown className={styles.icon} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className={styles.DropdownMenuContent}>
                <DropdownMenu.Item className={styles.DropdownMenuItem}>
                  <button onClick={() => setTimeSpan("Last Week")}>
                    Last Week
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item className={styles.DropdownMenuItem}>
                  <button onClick={() => setTimeSpan("Last Month")}>
                    Last Month
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item className={styles.DropdownMenuItem}>
                  <button onClick={() => setTimeSpan("All Time")}>
                    All Time
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <div className={styles.impactSummaryContainer}>
        {impactSummaryPlayer?.map((metric) => (
          <ImpactSummaryCard
            metric={metric}
            timeSpan={timeSpan}
            key={metric.title}
          />
        ))}
      </div>

      <div className={styles.chartAndRecentSessionsContainer}>
        <div className={styles.chartContainer}>
          <h2>Impact Histogram</h2>
          {metricData ? (
            <StackedBarChart {...metricData} />
          ) : (
            <div>No data Available</div>
          )}
        </div>
        <div className={styles.criticalSessions}>
          <h2>Critical Sessions</h2>
          {criticalSessionsData?.length == 0 && <p>No sessions recorded</p>}
          {criticalSessionsData?.map((session) => (
            <div className={styles.criticalSessionContainer} key={session.name}>
              <CriticalSession
                name={session.name}
                date={session.date}
                cumulative={session.cumulative}
                average={session.average}
                highest={session.highest}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PlayerAnalytics;
