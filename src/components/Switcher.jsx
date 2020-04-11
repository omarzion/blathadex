import React from 'react';
import classnames from 'classnames';

export default function Switcher(props) {
  const { options, onChange, big } = props;

  return (
    <div className={classnames('switcher', { big })}>
      {options.map(({ Svg, value, label }) => (
        <div
          key={value}
          className={value === props.value ? 'active' : ''}
          onClick={() => value !== props.value && onChange && onChange(value)}
        >
          <Svg />
          <label>{label}</label>
        </div>
      ))}
    </div>
  );
}
