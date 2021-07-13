import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import AppRoute from "./helpers/AppRoute";

import { DefaultLayout } from "./layouts";
import "./assets/scss/style.scss";
import { Preloader } from "./components";
import ScrollToTop from "./helpers/scroll-top";
import "./env.js"

// const Home = lazy(() => import("./pages/Home"));
const CarrierList = lazy(() => import("./pages/CarrierList"));
const Product = lazy(() => import("./pages/Product"));
const EstimateForm = lazy(() => import("./pages/EstimateForm"));
const Estimate = lazy(() => import("./pages/Estimate"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {

  return (
    <Router>
      <ScrollToTop>
        <Suspense fallback={<Preloader />}>
          <Switch>
            <AppRoute
              path={process.env.PUBLIC_URL + "/"}
              exact
              component={CarrierList}
              layout={DefaultLayout}
            />
            {/*<AppRoute*/}
            {/*  path={process.env.PUBLIC_URL + "/home"}*/}
            {/*  //TODO : 추후 Home 화면으로 활용*/}
            {/*  component={CarrierList}*/}
            {/*  layout={DefaultLayout}*/}
            {/*/>*/}
            <AppRoute
              path={process.env.PUBLIC_URL + "/product/:id"}
              component={Product}
              layout={DefaultLayout}
            />
            <AppRoute
                path={process.env.PUBLIC_URL + "/estimateForm/:id"}
                component={EstimateForm}
                layout={DefaultLayout}
            />
            <AppRoute
                path={process.env.PUBLIC_URL + "/estimate/:id"}
                component={Estimate}
                layout={DefaultLayout}
            />
            <AppRoute
              path={process.env.PUBLIC_URL + "/_ah_/warmup"}
              component={CarrierList}
              layout={DefaultLayout}
            />

            <AppRoute exact component={NotFound} layout={DefaultLayout} />
          </Switch>
        </Suspense>
      </ScrollToTop>
    </Router>
  );
}

export default App;
