export const getNormalizedCorners = ([y1, x1], [y2, x2]) => [
  [Math.min(y1, y2), Math.max(y1, y2)],
  [Math.min(x1, x2), Math.max(x1, x2)],
]

export const normalizeGridCoordinates = (start, end) => {
  const [[minY, maxY], [minX, maxX]] = getNormalizedCorners(start, end)

  return [`${minY + 1}/${maxY + 2}`, `${minX + 1}/${maxX + 2}`]
}

export const toGridCoordinate = ([y, x], cs, gap) => [
  cs / 2 + y * (cs + gap),
  cs / 2 + x * (cs + gap),
]

export const pairWiseDiff = ([a, c], [b, d]) => [a - b, c - d]

export const toRelativeGridCoordinate = ({ start, end, cellSize, gap }) => {
  const [[minY], [minX]] = getNormalizedCorners(start, end)

  return [start, end].map((c) =>
    toGridCoordinate(pairWiseDiff(c, [minY, minX]), cellSize, gap)
  )
}
