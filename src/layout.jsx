import styled from "styled-components"

export const MainLayout = styled.section`
  display: grid;
  grid-template-rows: 1fr auto;

  @media (min-width: 768px) {
    grid-template-rows: 1fr;
    grid-template-columns: auto 1fr;
  }

  @media (max-width: 767px) and (orientation: landscape) {
    grid-template-rows: 1fr;
    grid-template-columns: auto 1fr;
  }

  height: 100%;
  width: 100%;
`

export const CanvasLayout = styled.section`
  grid-row: 1;
  grid-column: 1;

  overflow: auto;

  @media (max-width: 767px) and (orientation: landscape) {
    grid-row: 1;
    grid-column: 2;
  }

  @media (min-width: 768px) {
    grid-row: 1;
    grid-column: 2;
  }

  display: flex;
  align-items: center;
  justify-content: center;
`
