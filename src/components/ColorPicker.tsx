import { Hue, Saturation } from 'react-color/lib/components/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomColorPicker(props: any) {
  return (
    <div
      style={{
        width: '100%',
        height: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '97%',
          height: '10px',
          marginBottom: '10px',
          border: '0.1px solid black'
        }}
      >
        <Hue {...props} onChange={props.onChange} />
      </div>
      <div
        style={{
          position: 'relative',
          width: '97%',
          height: '150px',
          marginBottom: '10px',
          border: '0.1px solid black'
        }}
      >
        <Saturation {...props} onChange={props.onChange} />
      </div>
    </div>
  );
}

export default CustomColorPicker;
