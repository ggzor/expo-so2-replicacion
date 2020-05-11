import styled from "styled-components"

export const Circle = styled.div`
  ${({ size }) => `width: ${size}px; height: ${size}px;`}
  border-radius: 50%;
  background-color: ${({ color }) => color};
  transition: 0.5s all ease-out;
`

export const DataCircle = styled(Circle)`
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  color: rgba(0, 0, 0, 0.7);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

export const Icon = styled.i`
  font-size: ${({ size }) => size || 1.2}em;
  color: white;
  ${({ row, column }) => `grid-row: ${row}; grid-column: ${column};`}
  transition: 0.5s all;
`
