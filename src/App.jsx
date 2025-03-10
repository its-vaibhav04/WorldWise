import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CitiesProvider } from "./contexts/CitiesContext.jsx";
import { lazy, Suspense } from "react";

const Product = lazy(() => import("./pages/product.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const Homepage = lazy(() => import("./pages/Homepage.jsx"));
const AppLayoutPromise = import("./pages/AppLayout");
const AppLayout = lazy(() => AppLayoutPromise);
const PathNotFound = lazy(() => import("./pages/PathNotFound.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));

import CityList from "./components/CityList.jsx";
import CountriesList from "./components/CountriesList.jsx";
import City from "./components/City.jsx";
import Form from "./components/Form.jsx";
import SpinnerFullPage from "./components/SpinnerFullPage.jsx";

function App() {
  return (
    <CitiesProvider>
      <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/product" element={<Product />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountriesList />} />
              <Route path="form" element={<Form />} />
            </Route>
            <Route path="*" element={<PathNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </CitiesProvider>
  );
}

export default App;
