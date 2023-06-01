import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isLoading,
  } = useInfiniteQuery(
    "sw-species",
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  );

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>Error! {error.toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
        {data.pages.map((pageData) => {
          return pageData.results.map((species) => {
            return (
              <Species
                averageLifespan={species.average_lifespan}
                key={species.name}
                language={species.language}
                name={species.name}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
