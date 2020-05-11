import * as React from "react"
import { animated } from "react-spring"
import {
  normalizeGridCoordinates,
  toRelativeGridCoordinate,
} from "../gridUtils"

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

const computeCurve = (props) => {
  const [[sy, sx], [ey, ex]] = toRelativeGridCoordinate(props)

  return `M ${sx} ${sy} C ${ex} ${sy + (ey - sy) * 0.618}, ${ex} ${
    sy + ((ey - sy) * 0.618 * 2) / 3
  }, ${ex} ${ey}`
}
