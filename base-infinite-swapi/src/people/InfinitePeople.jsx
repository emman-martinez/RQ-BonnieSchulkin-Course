import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isLoading,
  } = useInfiniteQuery(
    "sw-people",
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
          return pageData.results.map((person) => {
            return (
              <Person
                eyeColor={person.eye_color}
                hairColor={person.hair_color}
                key={person.name}
                name={person.name}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
