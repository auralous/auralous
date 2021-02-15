export const FRAGMENT_QUEUE_ITEM = /* GraphQL */ `
  fragment QueueItemParts on QueueItem {
    id
    trackId
    creatorId
  }
`;

export const MUTATION_UPDATE_QUEUE = /* GraphQL */ `
  mutation updateQueue(
    $id: ID!
    $action: QueueAction!
    $tracks: [ID!]
    $position: Int
    $insertPosition: Int
  ) {
    updateQueue(
      id: $id
      action: $action
      tracks: $tracks
      position: $position
      insertPosition: $insertPosition
    )
  }
`;

export const QUERY_QUEUE = /* GraphQL */ `
  query queue($id: ID!) {
    queue(id: $id) {
      id
      items {
        ...QueueItemParts
      }
    }
  }
  ${FRAGMENT_QUEUE_ITEM}
`;

export const SUBSCRIPTION_QUEUE = /* GraphQL */ `
  subscription onQueueUpdated($id: ID!) {
    queueUpdated(id: $id) {
      id
      items {
        ...QueueItemParts
      }
    }
  }
  ${FRAGMENT_QUEUE_ITEM}
`;
