import { QmsData } from "../ts/api";
import Plot from "react-plotly.js";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { PlotData } from "plotly.js";
import { Spin } from "antd";

type ChartSpec = {
  mode: PlotData["mode"];
  channel_idxs: number[];
};

const useHydration = (
  data: QmsData,
  channel_idxs: ChartSpec["channel_idxs"]
) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(false);
    data.hydrate_channels(channel_idxs).then(() => setHydrated(true));
  }, [channel_idxs]);

  return hydrated;
};

type Range = [number, number] | undefined;
type StateHook<T> = [T, Dispatch<SetStateAction<T>>];

type ChartData = {
  data: QmsData;
  rangeHook?: StateHook<Range>;
  _hydrated?: boolean;
};

const GROUND_SPEED_CH_IDX = 44;
const TIMELINE_IDXS = [GROUND_SPEED_CH_IDX];

const Timeline = ({
  data,
  rangeHook: [range, setRange] = useState(),
  _hydrated: hydrated = useHydration(data, TIMELINE_IDXS)
}: ChartData) =>
  hydrated ? (
    <div className="root">
      <style jsx>{`
        // TODO: Enable styled-jsx-postcss-plugin to DRY this up

        .root {
          width: 100%;
          height: 40px;
          overflow: hidden;
        }

        .root > :global(.plotly-timeline) {
          width: calc(100% + 153px);
          height: 450px;
        }

        .root > :global(.plotly-timeline) :global(.modebar) {
          display: none;
        }

        .root > :global(.plotly-timeline) :global(.cartesianlayer) {
          display: none;
        }

        .root > :global(.plotly-timeline) :global(.hoverlayer) {
          display: none;
        }

        .root > :global(.plotly-timeline) :global(.draglayer) {
          display: none;
        }

        .root > :global(.plotly-timeline) :global(.rangeslider-container) {
          transform: translate(3px, 0);
        }
      `}</style>
      <Plot
        className="plotly-timeline"
        data={[
          {
            y: data.channels[GROUND_SPEED_CH_IDX].data,
            type: "scatter",
            mode: "lines"
          }
        ]}
        useResizeHandler={true}
        layout={{
          title: "",
          xaxis: {
            range,
            rangeslider: {
              // KEEP THIS! Without it there's a weird bug
              range: [0, data.channels[GROUND_SPEED_CH_IDX].data!.length]
            }
          },
          yaxis: {
            fixedrange: true
          },
          autosize: true
        }}
        onRelayout={e => {
          const EVENT_NEWRANGE_ATTR = "xaxis.range";
          if (EVENT_NEWRANGE_ATTR in e) {
            setRange((e as any)[EVENT_NEWRANGE_ATTR]);
          }
        }}
        debug={true}
      />
    </div>
  ) : (
    <Spin />
  );

// const Chart = ({
//   mode,
//   channel_idxs,
//   data,
//   _hydrated: hydrated = useHydration(data, channel_idxs)
// }: ChartSpec & ChartData) =>
//   hydrated ? (
//     <Plot
//       data={channel_idxs.map(idx => ({
//         y: data.channels[idx].data,
//         type: "scatter",
//         mode
//       }))}
//       layout={{
//         title: channel_idxs.map(idx => data.channels[idx].name).join(" vs "),
//         xaxis: {
//           rangeslider: {}
//         },
//         yaxis: {
//           fixedrange: true
//         }
//       }}
//       onRelayout={e => {
//         console.log("RELAYOUT", e);
//       }}
//     />
//   ) : (
//     <Spin />
//   );

export default ({ data, charts }: { data: QmsData; charts: ChartSpec[] }) => (
  <>
    <Timeline data={data} />
  </>
);
