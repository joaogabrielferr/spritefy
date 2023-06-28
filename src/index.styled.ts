import styled, { css } from 'styled-components';

export const centralize = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MainSection = styled.div`
  width: 100%;
  ${centralize}
  margin: 0 auto;
  overflow: hidden;
  flex-direction: column;
`;

export const EditorWrapper = styled.div`
  width: 100%;
  ${centralize};
`;

export const MobileOptions = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 50px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

//slider//
export const SliderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
`;

export const SliderRange = styled.div`
  display: flex;
  width: 100%;
`;

export const SliderValue = styled.div`
  font-size: 12px;
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  color: white;
  left: 90%;
  top: 8%;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const Slider = styled.input`
  /* removing default appearance */
  -webkit-appearance: none;
  appearance: none;
  /* creating a custom design */
  width: 100%;
  cursor: pointer;
  outline: none;
  cursor: grab;
  border: 1px solid rgb(20, 20, 20);
  border-radius: 2px;
  /*  slider progress trick  */
  overflow: hidden;
  margin: 0;

  &:active {
    cursor: grabbing;
    border-style: none;
    border: 1px solid rgb(20, 20, 20);
  }

  /* Track: webkit browsers */
  &::-webkit-slider-runnable-track {
    height: 13px;
    background: #252525;
  }

  /* Track: Mozilla Firefox */
  &::-moz-range-track {
    height: 13px;
    background: #111;
  }

  /* Thumb: webkit */
  &::-webkit-slider-thumb {
    /* removing default appearance */
    -webkit-appearance: none;
    appearance: none;
    /* creating a custom design */
    height: 13px;
    width: 15px;
    background-color: #634cb8;
    border: 2px solid #634cb8;
    /*  slider progress trick  */
    box-shadow: -407px 0 0 400px #634cb8;
  }

  /* Thumb: Firefox */
  &::-moz-range-thumb {
    height: 13px;
    width: 15px;
    background-color: #634cb8;
    border: 1px solid #634cb8;
    /*  slider progress trick  */
    box-shadow: -407px 0 0 400px #634cb8;
  }
`;
