import { CartesianChart, Line } from "victory-native";

type LineChartData = {
    time: number,
    z: number
}

type Props = {
    lineChartData: LineChartData[]
}

export function LineChart({lineChartData}: Props) {
  return (
    <CartesianChart data={lineChartData} xKey="time" yKeys={["z"]}>
        {({ points }) => (
            <Line
            points={points.z}
            color="red"
            strokeWidth={1}
            animate={{ type: "timing", duration: 300 }}
            />
        )}
    </CartesianChart>
  );
}