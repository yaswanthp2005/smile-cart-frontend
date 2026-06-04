import { QUERY_KEYS } from "constants/query";

import productsApi from "apis/products";
import { Toastr } from "neetoui";
import { useTranslation } from "react-i18next";
import { useQuery, useQueries } from "react-query";
import useCartItemsStore from "stores/useCartItemsStore";

export const useFetchCartProducts = (slugs, { syncCartItems = true } = {}) => {
  const { t } = useTranslation();
  const { cartItems, setSelectedQuantity } = useCartItemsStore();

  const queries = (slugs || []).map(slug => ({
    queryKey: [QUERY_KEYS.PRODUCTS, slug],
    queryFn: () => productsApi.show(slug),
    onSuccess: ({ availableQuantity, name }) => {
      if (!syncCartItems) return;

      if (availableQuantity >= cartItems[slug]) return;

      setSelectedQuantity(slug, availableQuantity);
      if (availableQuantity === 0) {
        Toastr.error(t("product.error.removedFromCart", { name }), {
          autoClose: 2000,
        });
      }
    },
  }));

  const responses = useQueries(queries);

  if (queries.length === 0) return { data: [], isLoading: false };

  const isLoading = responses.some(r => r.isLoading);
  const data = responses.map(r => r.data).filter(Boolean);

  return { data, isLoading };
};

export const useShowProduct = slug =>
  useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, slug],
    queryFn: () => productsApi.show(slug),
  });

export const useFetchProducts = params =>
  useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, params],
    queryFn: () => productsApi.fetch(params),
    keepPreviousData: true,
  });
