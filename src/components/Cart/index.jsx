import { MRP, OFFER_PRICE } from "constants/constants";

import Header from "components/commons/Header";
import PageLoader from "components/commons/PageLoader";
import { cartTotalOf } from "components/utils";
import { useFetchCartProducts } from "hooks/reactQuery/useProductsApi";
import i18n from "i18next";
import { keys, isEmpty } from "ramda";
import useCartItemsStore from "stores/useCartItemsStore";
import withTitle from "utils/withTitle";

import PriceCard from "./PriceCard";
import ProductCard from "./ProductCard";

const Cart = () => {
  const cartItems = useCartItemsStore(store => store.cartItems);

  const slugs = keys(cartItems);
  const { data: products = [], isLoading } = useFetchCartProducts(slugs);

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

  const totalMrp = cartTotalOf(products, MRP, cartItems);
  const totalOfferPrice = cartTotalOf(products, OFFER_PRICE, cartItems);

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

export default withTitle(Cart, i18n.t("cart.title"));
