import { useState } from "react";

import { NavLink, Route, Redirect } from "react-router-dom";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";

import PageNotFound from "./components/commons/PageNotFound";
import CartItemsContext from "./components/contexts/CartItemsContext";
import Product from "./components/Product";
import ProductList from "./components/ProductList";

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <CartItemsContext.Provider value={{ cartItems, setCartItems }}>
      <div className="mx-4 flex space-x-2">
        <NavLink exact activeClassName="underline font-bold" to="/products">
          Home
        </NavLink>
        <NavLink exact activeClassName="underline font-bold" to="/product">
          Product
        </NavLink>
      </div>
      <Switch>
        <Route exact component={Product} path={routes.products.show} />
        <Route exact component={ProductList} path={routes.products.index} />
        <Redirect exact from={routes.root} to={routes.products.index} />
        <Route component={PageNotFound} path="*" />
      </Switch>
    </CartItemsContext.Provider>
  );
};

export default App;
