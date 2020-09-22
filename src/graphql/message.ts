export const FRAGMENT_MESSAGE_ALL = /* GraphQL */ `
  fragment MessageParts on Message {
    id
    createdAt
    message
    from {
      type
      id
      name
      photo
      uri
    }
  }
`;

export const MUTATION_SEND_MESSAGE = /* GraphQL */ `
  mutation sendMessage($roomId: ID!, $message: String!) {
    addMessage(roomId: $roomId, message: $message)
  }
`;

export const SUBSCRIPTION_MESSAGE = /* GraphQL */ `
  subscription onMessageAdded($roomId: ID!) {
    messageAdded(roomId: $roomId) {
      ...MessageParts
    }
  }
  ${FRAGMENT_MESSAGE_ALL}
`;
