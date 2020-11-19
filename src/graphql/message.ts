export const FRAGMENT_MESSAGE_ALL = /* GraphQL */ `
  fragment MessageParts on Message {
    id
    creatorId
    createdAt
    text
    type
  }
`;

export const QUERY_MESSAGE = /* GraphQL */ `
  query messages($id: ID!, $offset: Int, $limit: Int) {
    messages(id: $id, offset: $offset, limit: $limit) {
      ...MessageParts
    }
  }
`;

export const MUTATION_SEND_MESSAGE = /* GraphQL */ `
  mutation addMessage($id: ID!, $text: String!) {
    addMessage(id: $id, text: $text)
  }
`;

export const SUBSCRIPTION_MESSAGE = /* GraphQL */ `
  subscription onMessageAdded($id: ID!) {
    messageAdded(id: $id) {
      ...MessageParts
    }
  }
  ${FRAGMENT_MESSAGE_ALL}
`;
