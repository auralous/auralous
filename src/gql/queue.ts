export const FRAGMENT_QUEUE_ITEM = /* GraphQL */ `
  fragment QueueItemParts on QueueItem {
    trackId
    creatorId
  }
`;

export const MUTATION_QUEUE_ADD = /* GraphQL */ `
  mutation queueAdd($id: ID!, $tracks: [ID!]!) {
    queueAdd(id: $id, tracks: $tracks)
  }
`;

export const MUTATION_QUEUE_REMOVE = /* GraphQL */ `
  mutation queueRemove($id: ID!, $trackId: ID!, $creatorId: ID!) {
    queueRemove(id: $id, trackId: $trackId, creatorId: $creatorId)
  }
`;

export const MUTATION_QUEUE_REORDER = /* GraphQL */ `
  mutation queueReorder($id: ID!, $position: Int!, $insertPosition: Int!) {
    queueReorder(id: $id, position: $position, insertPosition: $insertPosition)
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
