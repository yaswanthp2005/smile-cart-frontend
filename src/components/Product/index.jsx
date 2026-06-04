import { useShowProduct } from "hooks/reactQuery/useProductsApi";
import useSelectedQuantity from "hooks/useSelectedQuantity";
import { LeftArrow } from "neetoicons";
import { Spinner, Button } from "neetoui";
import { isNotNil } from "ramda";
import { useParams, useHistory } from "react-router-dom";
import routes from "routes";

import Carousel from "./Carousel";

import AddToCart from "../commons/AddToCart";
import PageNotFound from "../commons/PageNotFound";

const Product = () => {
  const history = useHistory();
  const { slug } = useParams();

  const { selectedQuantity, setSelectedQuantity } = useSelectedQuantity(slug);

  const { data: product, isLoading, isError } = useShowProduct(slug);

  const { name, description, mrp, offerPrice, imageUrls, imageUrl } = product;
  const totalDiscounts = mrp - offerPrice;
  const discountPercentage = ((totalDiscounts / mrp) * 100).toFixed(1);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) return <PageNotFound />;

  return (
    <div className="px-6 pb-6">
      <div>
        <LeftArrow
          className="hover:neeto-ui-bg-gray-400 neeto-ui-rounded-full mr-6"
          onClick={history.goBack}
        />
        <p className="py-2 text-4xl font-semibold">{name}</p>
        <hr className="border-2 border-black" />
      </div>
      <div className="mt-16 flex gap-4">
        <div className="w-2/5">
          <div className="flex justify-center gap-16">
            {isNotNil(imageUrls) ? (
              <Carousel />
            ) : (
              <img alt={name} className="w-48" src={imageUrl} />
            )}
          </div>
        </div>
        <div className="w-3/5 space-y-4">
          <p>{description}</p>
          <p>MRP: {mrp}</p>
          <p className="font-semibold">Offer price: {offerPrice}</p>
          <p className="font-semibold text-green-600">
            {discountPercentage}% off
          </p>
          <div className="flex space-x-10">
            <AddToCart
              {...{ availableQuantity: product.availableQuantity, slug }}
            />
            <Button
              className="bg-neutral-800 hover:bg-neutral-950"
              label="Buy now"
              size="large"
              to={routes.checkout}
              onClick={() => setSelectedQuantity(selectedQuantity || 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
