import Plot from "react-plotly.js";
import { useState, useMemo } from "react";
import { Spin } from "antd";
import iterate from "iterare";

import { MaybeRange, ScatterChartSpec, ChannelIdx } from "../../ts/chart/types";
import { StateHook } from "../../ts/hooks";
import { log } from "../../ts/debug";
import {
  spec2ChannelIdxs,
  getUpdateHandler,
  yAxesLayout,
  yAxisName,
  axisTitle,
  baseChartSettings,
} from "../../ts/chart/helpers";
import {
  QmsData,
  useCrossfilteredData,
  Channel,
  CrossFilters,
  getChannels,
} from "../../ts/qmsData";
import { useMaybeGroupByColorBins } from "./_helpers";

export default function ScatterChart({
  spec,
  data,
  filtersState: [filters, setFilters],
}: {
  spec: ScatterChartSpec;
  data: QmsData;
  filtersState: StateHook<CrossFilters>;
}) {
  // jet colour interpolator with internal cache
  const { discreteJetColors, groupBy } = useMaybeGroupByColorBins(data, spec);

  const crossfilterData = useCrossfilteredData(data, {
    channelIdxs: useMemo(() => [spec.xAxis, ...spec2ChannelIdxs(spec)], [spec]),
    filters,
    groupBy,
  });

  if (crossfilterData === null) {
    return <Spin />;
  } else {
    const defaults = (yChannel: Channel) => ({
      type: "scattergl" as any,
      mode: "markers" as any,
      name: yChannel.name,
      yaxis: yAxisName(yChannel.idx)(spec),
    });

    const [xChannel, yRangeChannel] = getChannels(data, [
      spec.xAxis,
      spec.rangeType == "Colour-Scaled" ? spec.yAxis : spec.yAxes[0][0],
    ]);
    const xRange = filters.show.byChannels.get(xChannel);
    const yRange = filters.show.byChannels.get(yRangeChannel);

    return (
      <Plot
        {...baseChartSettings}
        data={
          "groups" in crossfilterData // if we're using discrete color-scale
            ? iterate(crossfilterData.groups)
                .map(([groupIdx, channelGroup]) => {
                  if (
                    spec.rangeType === "Colour-Scaled" &&
                    spec.nColorBins !== null
                  ) {
                    const [yChannel] = getChannels(data, [spec.yAxis]);

                    const [min, max] = crossfilterData.groupedRange;

                    // repeat calls to this are cached
                    const { stop, color } = discreteJetColors(
                      min,
                      max,
                      spec.nColorBins!
                    )[groupIdx];

                    return {
                      ...defaults(yChannel),
                      x: channelGroup.channels.get(xChannel),
                      y: channelGroup.channels.get(yChannel),
                      name: `<= ${stop.toPrecision(3)}`,
                      marker: { color, symbol: "circle-open" },
                    };
                  } else {
                    // TODO: merge spec with channelGroup output so that this becomes a typeerror instead of a runtime error
                    throw new Error("Code path should never resolve");
                  }
                })
                .toArray()
                .reverse()
            : spec.rangeType === "Colour-Scaled"
            ? // continuous color-scale
              ((
                [yChannel, colorChannel] = getChannels(data, [
                  spec.yAxis,
                  spec.colorAxis,
                ])
              ) => [
                {
                  ...defaults(yChannel),
                  x: crossfilterData.channels.get(xChannel),
                  y: crossfilterData.channels.get(yChannel),

                  marker: {
                    symbol: "circle-open",
                    color: crossfilterData.channels.get(colorChannel),
                    colorscale: "Jet",
                    colorbar: {
                      title: {
                        text: axisTitle(colorChannel),
                        side: "right",
                      },
                    },
                  },
                },
              ])()
            : getChannels(data, spec.yAxes.flat()).map((yChannel) => ({
                ...defaults(yChannel),
                x: crossfilterData.channels.get(xChannel),
                y: crossfilterData.channels.get(yChannel),
                // TODO: properly support multiple y axes here
                name: yChannel.name,
                marker: {
                  symbol: "circle-open",
                },
              }))
        }
        layout={{
          title: spec.title,
          autosize: true,
          ...yAxesLayout(
            yRange,
            data.channels[
              spec.rangeType === "Colour-Scaled" ? spec.yAxis : spec.yAxes[0][0]
            ] as Channel
          )(spec),
          xaxis: {
            title: axisTitle(getChannels(data, [spec.xAxis])[0]),
            range: filters.show.byChannels.get(xChannel),
          },
          hovermode: "closest",
        }}
        onUpdate={getUpdateHandler(xRange, yRange, (newXRange, newYRange) => {
          function updateShowFilters(channel: Channel, newRange: MaybeRange) {
            if (newRange) {
              filters.show.byChannels.set(channel, newRange);
            } else {
              filters.show.byChannels.delete(channel);
            }
          }
          updateShowFilters(xChannel, newXRange);
          updateShowFilters(yRangeChannel, newYRange);
          if (newXRange) {
          }
          filters.show.byTime = newXRange;
          if (newYRange) {
            filters.show.byChannels.set(yRangeChannel, newYRange);
          } else {
            filters.show.byChannels.delete(yRangeChannel);
          }
          setFilters({ ...filters });
        })}
      />
    );
  }
}
