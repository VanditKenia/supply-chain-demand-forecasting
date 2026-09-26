"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface EChartWrapperProps {
  options: echarts.EChartsOption;
  height?: string | number;
  className?: string;
  loading?: boolean;
}

export const EChartWrapper: React.FC<EChartWrapperProps> = ({
  options,
  height = "320px",
  className = "",
  loading = false,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, undefined, {
        renderer: "canvas",
      });
    }

    const chart = chartInstance.current;

    if (loading) {
      chart.showLoading({
        text: "Loading data...",
        color: "#c75b32",
        textColor: "#191917",
        maskColor: "rgba(246, 242, 234, 0.6)",
      });
    } else {
      chart.hideLoading();
      chart.setOption(options, true);
    }

    const handleResize = () => {
      chart.resize();
    };

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [options, loading]);

  return (
    <div
      ref={chartRef}
      className={`echart-container ${className}`}
      style={{ width: "100%", height, minHeight: height }}
    />
  );
};
