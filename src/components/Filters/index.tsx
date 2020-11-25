import React from 'react';
import { Range, getTrackBackground } from 'react-range';

export function Filters({
  countFlight,
  setCountFlight,
}: {
  countFlight: number[];
  setCountFlight: (num: number[]) => void;
}) {
  return (
    <Range
      step={1}
      min={0}
      max={50}
      values={countFlight}
      onChange={setCountFlight}
      renderTrack={({ props, children }) => (
        <div
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          style={{
            ...props.style,
            height: '36px',
            display: 'flex',
            width: '100%',
          }}
        >
          <div
            ref={props.ref}
            style={{
              height: '5px',
              width: '100%',
              borderRadius: '4px',
              background: getTrackBackground({
                values: countFlight,
                colors: ['#548BF4', '#ccc'],
                min: 0,
                max: 50,
              }),
              alignSelf: 'center',
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ props, value, isDragged }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: '42px',
            width: '42px',
            borderRadius: '4px',
            backgroundColor: '#FFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0px 2px 6px #AAA',
          }}
        >
          <div
            style={{
              color: isDragged ? '#548BF4' : '#CCC',
            }}
          >
            {value}
          </div>
        </div>
      )}
    />
  );
}

export default Filters;
