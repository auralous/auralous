export const createFlatlistProps = (itemSize: number) => {
  return {
    getItemLayout(data: unknown, index: number) {
      return {
        length: itemSize,
        offset: itemSize * index,
        index,
      };
    },
    estimatedItemSize: itemSize,
  };
};
