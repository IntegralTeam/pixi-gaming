import React, { useEffect, useState } from 'react';
import * as go from 'gojs';
import { debounce } from 'throttle-debounce';
import { DiagramWrapper } from './components/DiagramWrapper';
import { ItemListFlight } from './components/ItemListFlight';
import { Filters } from './components/Filters';
import { getFlights } from './api';
import { getAirports } from './utils';
import { Flight, Airport, Link } from './types';
import './App.css';

const debounceFunc = debounce(200, false, async (num: number, setFlights, setIsLoading) => {
  setIsLoading(true);
  const flights = await getFlights(num);
  setFlights(flights);
  setIsLoading(false);
});

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [countFlight, setCountFlight] = useState([3]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [activeFight, setActiveFight] = useState<string>();

  function handleModelChange(changes: any) {
  }

  function handleModelSelect(e: go.DiagramEvent) {
  }

  const handleSetActive = (flightNumber: string) => () => {
    setActiveFight(flightNumber === activeFight ? undefined : flightNumber);
  };

  useEffect(() => {
    debounceFunc(countFlight[0], setFlights, setIsLoading);
  }, [countFlight]);

  useEffect(() => {
    setAirports(getAirports(flights));
    setLinks(
      flights.map((item, key) => ({
        key: item.flight.number,
        from: item.arrival.iata,
        to: item.departure.iata,
        text: 'plane',
      }))
    );
  }, [flights]);

  useEffect(() => {
    const activeFlightItem = flights.find(
      (item) => item.flight.number === activeFight
    );
    setAirports(
      airports.map((item) => {
        if (
          activeFlightItem?.arrival.iata === item.key ||
          activeFlightItem?.departure.iata === item.key
        ) {
          return {
            ...item,
            color: 'red',
          };
        }
        return {
          ...item,
          color: 'lightgray',
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFight]);

  return (
    <div className="App">
      <div className="row">
        <DiagramWrapper
          skipsDiagramUpdate={false}
          nodeDataArray={airports}
          linkDataArray={links}
          modelData={{
            canRelink: true,
          }}
          onDiagramEvent={handleModelSelect}
          onModelChange={handleModelChange}
        />
        <div className="containerList">
          {flights.map((item, index) => (
            <ItemListFlight
              item={item}
              index={index}
              key={item.flight.number}
              handleSetActive={handleSetActive}
              isActive={item.flight.number === activeFight}
            />
          ))}
        </div>
        {isLoading && (
          <div className="spinnerContainer">
            <div className="textLoading">
              Loading...
            </div>
          </div>
        )}
      </div>
      <Filters
        countFlight={countFlight}
        setCountFlight={setCountFlight}
      />
    </div>
  );
}

export default App;
