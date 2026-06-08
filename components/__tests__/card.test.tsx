import React from "react";
import { render } from "@testing-library/react-native";

interface CardProps {
  metric: string;
  value: string;
  maximumWidth: boolean;
}

jest.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({
    theme: {
      text: "#000",
      background: "#fff",
      card: "#f5f5f5",
      border: "#e0e0e0",
      secondary: "#000",
      textMuted: "#666",
      surfaceContainer: "#eee",
    },
  }),
}));

const loadCard = (): React.ComponentType<CardProps> =>
  require("../card").default;

describe("Card", () => {
  it("renders metric and value", () => {
    const Card = loadCard();
    const { getByText } = render(<Card metric="Time" value="1.5s" maximumWidth={false} />);

    expect(getByText("Time")).toBeTruthy();
    expect(getByText("1.5s")).toBeTruthy();
  });

  it("renders with full width when maximumWidth is true", () => {
    const Card = loadCard();
    const { getByText } = render(<Card metric="Score" value="95%" maximumWidth={true} />);

    expect(getByText("Score")).toBeTruthy();
    expect(getByText("95%")).toBeTruthy();
  });
});
