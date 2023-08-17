import { Hue, Saturation } from 'react-color/lib/components/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomColorPicker(props: any) {
  return (
    <div
      style={{
        width: '90%',
        height: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '5px',
        borderRadius: '5px'
      }}>
      <div
        style={{
          position: 'relative',
          width: '97%',
          height: '15px',
          marginBottom: '10px',
          borderRadius: '5px'
        }}>
        <Hue {...props} onChangeComplete={props.onChange} />
      </div>
      <div
        style={{
          position: 'relative',
          width: '97%',
          height: '150px',
          marginBottom: '10px',
          borderRadius: '5px'
        }}>
        <Saturation {...props} onChangeComplete={props.onChange} />
      </div>
    </div>
  );
}

export default CustomColorPicker;
