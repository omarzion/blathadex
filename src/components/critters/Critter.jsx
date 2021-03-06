import classnames from 'classnames';
import { Link, navigate } from 'gatsby';
import React, { useCallback } from 'react';
import { useSelectedContext } from 'app/context';
import { createImgSrc, createCritterLink } from 'app/utils';
import Checkmark from 'images/inline/checkmark.svg';
import WarningIcon from 'images/inline/warningIcon.svg';
import { useLongPressable } from '../LongPressableDiv';
import './critter.scss';
import Img from 'gatsby-image';

export const CritterImage = ({ type, name, image, style = {}, ...rest }) =>
  image ? (
    <Img
      fluid={{ ...image.childImageSharp.fluid }}
      alt={name}
      style={style}
      imgStyle={style}
      {...rest}
    />
  ) : (
    <img {...rest} alt={name} src={createImgSrc({ type, name })} style={style} />
  );

export const CritterBlock = critter => {
  const { name, type, caught, leaving, allowSelect, loading } = critter;
  const { selected, toggle } = useSelectedContext();

  const handleClick = useCallback(
    e => {
      if (!selected.length) {
        navigate(createCritterLink(critter));
      } else {
        toggle(critter);
      }
    },
    [selected.length, critter, toggle]
  );

  const lpProps = useLongPressable({
    onClick: handleClick,
    onLongPress: () => allowSelect && toggle(critter),
  });

  return (
    <button
      {...lpProps}
      data-selected={!!~selected.indexOf(critter.id)}
      className={classnames('critter block', { caught, leaving, loading })}
    >
      <div className='stack'>
        <Link to={createCritterLink(critter)} />
        <CritterImage image={critter.image} type={type} name={name} />
        {caught && <Checkmark className='badge bottom left' />}
        {leaving && <WarningIcon className='badge top right overhang' />}
      </div>
    </button>
  );
};

export const CritterCollection = ({
  critters = [],
  caught,
  splitCaught,
  multiSelect,
  leaving = [],
  loading
}) => {
  let caughtCritters = !caught
    ? []
    : critters.filter(
        (critter = {}) => !!caught.find(c => c.type === critter.type && c.no === critter.no)
      );
  let caughtIds = caughtCritters.map(c => c.id);
  let topCritters = critters;

  if (splitCaught) {
    topCritters = critters.filter(critter => !~caughtIds.indexOf(critter.id));
  }

  return (
    <>
      {topCritters.map(critter => (
        <CritterBlock
          loading={loading}
          allowSelect={multiSelect}
          key={critter.id}
          {...critter}
          leaving={!!~leaving.indexOf(critter.id)}
          caught={!splitCaught && !!~caughtIds.indexOf(critter.id)}
        />
      ))}
      {splitCaught &&
        caughtCritters.map(critter => (
          <CritterBlock
            loading={loading}
            key={critter.id}
            {...critter}
            caught
            leaving={!!~leaving.indexOf(critter.id)}
          />
        ))}
    </>
  );
};
