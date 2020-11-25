import { Flight, Airport } from '../types';

export const getAirports = (flights: Flight[]): Airport[] => {
  let airports: { [id: string]: { iata: string; flightDate: string } } = {};
  flights.forEach((item) => {
    airports[item.arrival.airport] = {
      iata: item.arrival.iata,
      flightDate: item.flight_date,
    };
    airports[item.departure.airport] = {
      iata: item.departure.iata,
      flightDate: item.flight_date,
    };
  });
  return Object.keys(airports).map((item) => {
    return {
      key: airports[item].iata,
      text: item,
      color: 'lightgray',
    };
  });
};