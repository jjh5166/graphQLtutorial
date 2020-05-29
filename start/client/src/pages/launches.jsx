import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
// The useQuery hook is one of the most important building blocks of an Apollo app.
// It's a React Hook that fetches a GraphQL query and exposes the result so you can render your UI based
// on the data it returns.

// The useQuery hook leverages React's Hooks API to fetch and load data from queries into our UI.
// It exposes error, loading and data properties through a result object, that help us populate and render
// our component.
import gql from "graphql-tag";

import { LaunchTile, Header, Button, Loading } from "../components";

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    # Here, we're defining a query to fetch a list of launches by calling the launches query from our schema.
    # The launches query returns an object type with a list of launches, in addition to the cursor of the paginated
    # list and whether or not the list hasMore launches. We need to wrap the query with the gql function in order to
    # parse it into an AST.
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
`;

const Launches = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_LAUNCHES);
  // To render the list, we pass the GET_LAUNCHES query from the previous step into our useQuery hook.
  // Then, depending on the state of loading, error, and data, we either render a loading indicator,
  // an error message, or a list of launches.
  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map(launch => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}
      {data.launches &&
        data.launches.hasMore && (
          <Button
            onClick={() =>
              fetchMore({
                variables: {
                  after: data.launches.cursor,
                },
                updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...fetchMoreResult,
                    launches: {
                      ...fetchMoreResult.launches,
                      launches: [
                        ...prev.launches.launches,
                        ...fetchMoreResult.launches.launches,
                      ],
                    },
                  };
                },
              })
            }
          >
            Load More
          </Button>
        )
      }
    </Fragment>
  );
};

export const LAUNCH_TILE_DATA = gql`
# We define a GraphQL fragment by giving it a name (LaunchTile) and defining it on a type on our schema (Launch).
# The name we give our fragment can be anything, but the type must correspond to a type in our schema.
  fragment LaunchTile on Launch {
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;
export default Launches;