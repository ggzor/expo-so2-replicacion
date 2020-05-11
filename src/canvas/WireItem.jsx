import * as React from "react"
import { animated } from "react-spring"

const wireItemColorByState = {
  none: "#999999",
  success: "#52E099",
  failure: "#E05252",
  pending: "#E0E052",
}

const WireItemBase = (props) => {
  const { start, end, state, progress } = props
  const [row, column] = normalizeGridCoordinates(start, end)

  return (
    <div
      style={{
        gridColumn: column,
        gridRow: row,
        zIndex: -1,
      }}
    >
      <svg
        style={{ width: "100%", height: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          style={{
            transition: "stroke 500ms ease-out",
          }}
          strokeDashoffset={1 - progress}
          strokeDasharray="1"
          pathLength="1"
          strokeOpacity="0.7"
          d={computeCurve(props)}
          fill="transparent"
          stroke={wireItemColorByState[state || "none"]}
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}

export const WireItem = animated(WireItemBase)

const getNormalizedCorners = ([y1, x1], [y2, x2]) => [
  [Math.min(y1, y2), Math.max(y1, y2)],
  [Math.min(x1, x2), Math.max(x1, x2)],
]

const normalizeGridCoordinates = (start, end) => {
  const [[minY, maxY], [minX, maxX]] = getNormalizedCorners(start, end)

  return [`${minY + 1}/${maxY + 2}`, `${minX + 1}/${maxX + 2}`]
}

const toGridCoordinate = ([y, x], cs, gap) => [
  cs / 2 + y * (cs + gap),
  cs / 2 + x * (cs + gap),
]

const pairWiseDiff = ([a, c], [b, d]) => [a - b, c - d]

const computeCurve = ({ start, end, cellSize, gap }) => {
  const [[minY], [minX]] = getNormalizedCorners(start, end)

  const [sy, sx] = toGridCoordinate(
    pairWiseDiff(start, [minY, minX]),
    cellSize,
    gap
  )
  const [ey, ex] = toGridCoordinate(
    pairWiseDiff(end, [minY, minX]),
    cellSize,
    gap
  )

  return `M ${sx} ${sy} C ${ex} ${sy + (ey - sy) * 0.618}, ${ex} ${
    sy + ((ey - sy) * 0.618 * 2) / 3
  }, ${ex} ${ey}`
}
