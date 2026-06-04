import { useState } from "react";

import { useFetchProducts } from "hooks/reactQuery/useProductsApi";
import useFuncDebounce from "hooks/useFuncDebounce";
import useQueryParams from "hooks/useQueryParams";
import { filterNonNull, serializeKeysToSnakeCase } from "neetocist";
import { Search } from "neetoicons";
import { Input, Pagination, Spinner, NoData } from "neetoui";
import { stringify } from "qs";
import { isEmpty, mergeLeft } from "ramda";
import { useHistory } from "react-router-dom";
import routes from "routes";

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "./constants";
import ProductListItem from "./ProductListItem";

import Header from "../commons/Header";

const ProductList = () => {
  const queryParams = useQueryParams();
  const { page, pageSize, searchTerm = "" } = queryParams;

  const [searchKey, setSearchKey] = useState(searchTerm);

  const history = useHistory();

  const updateQueryParams = useFuncDebounce(value => {
    const params = {
      page: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      searchTerm: value || null,
    };

    history.replace(
      `${routes.products.index}?${stringify(
        serializeKeysToSnakeCase(filterNonNull(params))
      )}`
    );
  });

  const productsParams = {
    searchTerm,
    page: Number(page) || DEFAULT_PAGE_INDEX,
    pageSize: Number(pageSize) || DEFAULT_PAGE_SIZE,
  };

  const { data: { products = [], totalProductsCount } = {}, isLoading } =
    useFetchProducts(productsParams);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header
        shouldShowBackButton={false}
        title="Smile Cart"
        actionBlock={
          <Input
            placeholder="Search products"
            prefix={<Search />}
            type="search"
            value={searchKey}
            onChange={({ target: { value } }) => {
              updateQueryParams(value);
              setSearchKey(value);
            }}
          />
        }
      />
      {isEmpty(products) ? (
        <NoData className="h-full w-full" title="No products to show" />
      ) : (
        <>
          <div className="grid grid-cols-2 justify-items-center gap-y-8 p-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
              <ProductListItem key={product.slug} {...product} />
            ))}
          </div>
          <div className="mb-5 self-end">
            <Pagination
              count={totalProductsCount}
              pageNo={Number(page) || DEFAULT_PAGE_INDEX}
              pageSize={Number(pageSize) || DEFAULT_PAGE_SIZE}
              navigate={page =>
                history.replace(
                  `${routes.products.index}?${stringify(
                    serializeKeysToSnakeCase(
                      filterNonNull(
                        mergeLeft(
                          { page, pageSize: DEFAULT_PAGE_SIZE },
                          queryParams
                        )
                      )
                    )
                  )}`
                )
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
