/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";

const CitiesContext = createContext();

const loadInitialState = () => {
  try {
    const storedCities = localStorage.getItem("cities");
    return {
      cities: storedCities ? JSON.parse(storedCities) : [],
      isLoading: false,
      currentCity: {},
      error: "",
    };
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return {
      cities: [],
      isLoading: false,
      currentCity: {},
      error: "",
    };
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/created":
      // eslint-disable-next-line no-case-declarations
      const updatedCities = [...state.cities, action.payload];
      return {
        ...state,
        isLoading: false,
        cities: updatedCities,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    null,
    loadInitialState
  );

  useEffect(() => {
    try {
      console.log("Saving cities to localStorage:", cities);
      localStorage.setItem("cities", JSON.stringify(cities));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [cities]);

  const getCity = useCallback(
    function getCity(id) {
      if (id === currentCity.id) return;

      dispatch({ type: "loading" });

      try {
        const city = cities.find((city) => String(city.id) === String(id));
        if (city) dispatch({ type: "city/loaded", payload: city });
        else throw new Error("City not found");
      } catch {
        dispatch({
          type: "rejected",
          payload: "Could not find city",
        });
      }
    },
    [currentCity.id, cities]
  );

  function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const cityWithId = {
        ...newCity,
        id: String(new Date().getTime()),
      };

      dispatch({ type: "city/created", payload: cityWithId });

      setTimeout(() => {
        console.log(
          "Confirming localStorage save:",
          localStorage.getItem("cities")
        );
      }, 100);

      return cityWithId;
    } catch (err) {
      console.error("Error creating city:", err);
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city.",
      });
    }
  }

  function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      console.error("Error deleting city:", err);
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city.",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext used outside of CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
