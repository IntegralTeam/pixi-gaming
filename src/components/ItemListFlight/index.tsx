import React from 'react';
import { Flight } from '../../types';

import './ItemListFlight.css';

export function ItemListFlight({
  item,
  handleSetActive,
  index,
  isActive,
}: {
  item: Flight;
  handleSetActive: Function;
  index: number;
  isActive: boolean;
}) {
  return (
    <button
      className={isActive ? 'itemActive' : 'item' }
      key={`${item.flight.number}`}
      onClick={handleSetActive(item.flight.number)}
      type="button"
    >
      {`${index + 1}. Fight from ${item.arrival.airport} to ${
        item.departure.airport
      }, scheduled for  ${item.flight_date}`}
    </button>
  );
}

export default ItemListFlight;
