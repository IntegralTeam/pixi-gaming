export type Flight = {
  arrival: { airport: string; iata: string };
  departure: { airport: string; iata: string };
  flight: { number: string };
  flight_date: string;
};

export type Airport = {
  key: string;
  text: string;
  color: string;
};

export type Link = {
  key: string;
  from: string;
  to: string;
};