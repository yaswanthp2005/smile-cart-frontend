import { useEffect, useState } from "react";

import productsApi from "apis/products";
import Header from "components/commons/Header";
import PageLoader from "components/commons/PageLoader";
import { MRP, OFFER_PRICE } from "components/constants";
import { cartTotalOf } from "components/utils";
import { Toastr } from "neetoui";
import { keys, isEmpty } from "ramda";
import useCartItemsStore from "stores/useCartItemsStore";

import PriceCard from "./PriceCard";
import ProductCard from "./ProductCard";

const Cart = () => {
  const { cartItems, setSelectedQuantity } = useCartItemsStore();

  const slugsList = keys(cartItems);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const removeCartItem = useCartItemsStore(store => store.removeCartItem);

  const fetchCartProducts = async () => {
    try {
      const responses = await Promise.all(
        slugsList.map(slug => productsApi.show(slug))
      );

      setProducts(responses);

      responses.forEach(response => {
        const { availableQuantity, name, slug } = response || {};

        // If API didn't return availability info, remove the item safely
        if (typeof availableQuantity !== "number") {
          removeCartItem(slug);
          Toastr.error(
            `${
              name || slug
            } is no longer available and has been removed from cart`,
            { autoClose: 2000 }
          );

          return;
        }

        const selected = parseInt(cartItems[slug]) || 0;
        if (availableQuantity >= selected) return;

        setSelectedQuantity(slug, availableQuantity);
        if (availableQuantity === 0) {
          Toastr.error(
            `${name} is no longer available and has been removed from cart`,
            {
              autoClose: 2000,
            }
          );
        }
      });
    } catch (error) {
      console.log("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  if (isLoading) return <PageLoader />;

  if (isEmpty(products)) {
    return (
      <>
        <Header title="My Cart" />
        <div className="flex h-screen items-center justify-center">
          <div className="neeto-ui-text-gray-500">Your cart is empty!</div>
        </div>
      </>
    );
  }

  const totalMrp = cartTotalOf(products, MRP);
  const totalOfferPrice = cartTotalOf(products, OFFER_PRICE);

  return (
    <>
      <Header title="My Cart" />
      <div className="mt-10 flex justify-center space-x-10">
        <div className="w-1/3 space-y-5">
          {products.map(product => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
        {totalMrp > 0 && (
          <div className="w-1/4">
            <PriceCard {...{ totalMrp, totalOfferPrice }} />
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
