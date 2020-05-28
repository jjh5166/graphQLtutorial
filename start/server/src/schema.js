const { gql } = require('apollo-server');

const typeDefs = gql`
  # The Launch object type has a collection of fields, and each field has a type of its own.
  # A field's type can be either an object type or a scalar type. A scalar type is a primitive 
  # (like ID, String, Boolean, or Int) that resolves to a single value. In addition to GraphQL's 
  # built-in scalar types, you can define custom scalar types.
  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
    # An exclamation point (!) after a declared field's type means "this field's value can never be null."
  }
  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
    # If a declared field's type is in [Square Brackets], it's an array of the specified type.
    # If an array has an exclamation point after it, the array cannot be null, but it can be empty.
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }
  # A schema needs to define queries that clients can execute against the data graph.
  # You define your data graph's supported queries as fields of a special type called the Query type.
  type Query {
    launches(
    """
    The number of results to show. Must be >= 1. Default = 20
    """
    pageSize: Int
    """
    If you add a cursor here, it will only return results _after_ this cursor
    """
    after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User
  }
  """
  Simple wrapper around our list of launches that contains a cursor to the
  last item in the list. Pass this cursor to the launches query to fetch results
  after these.
  """
  type LaunchConnection {
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }
  # Query.launches takes in two parameters (pageSize and after) and returns a LaunchConnection object.

  # The LaunchConnection includes:
  # A list of launches (the actual data requested by a query)
  # A cursor that indicates the current position in the data set
  # A hasMore boolean that indicates whether the data set contains any more items beyond those included in launches

  type Mutation {
    # To enable clients to modify data, our schema needs to define some mutations.
    # The Mutation type is a special type that's similar in structure to the Query type. 
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): String # login token
  }
  # A mutation's return type is entirely up to you, but we recommend defining special object 
  # types specifically for mutation responses.
  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }
  # It's good practice for a mutation to return whatever objects it modifies so the requesting 
  # client can update its cache and UI without needing to make a followup query.
`;

module.exports = typeDefs;