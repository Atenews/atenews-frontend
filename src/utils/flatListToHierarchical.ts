const flatListToHierarchical = (
  data: Menu[] = [],
  {
    idKey = 'id',
    parentKey = 'parentId',
    childrenKey = 'children',
  }: {
    idKey?: string;
    parentKey?: string;
    childrenKey?: string;
  } = {},
) => {
  const tree: Menu[] = [];
  const childrenOf: Record<string, Menu[]> = {};
  data.forEach((item) => {
    const newItem = { ...item };
    const { [idKey]: id, [parentKey]: parentId = 0 } = newItem;
    childrenOf[id as string] = childrenOf[id as string] || [];
    newItem[childrenKey] = childrenOf[id as string];
    if (parentId) {
      childrenOf[parentId as string] = childrenOf[parentId as string] || [];
      childrenOf[parentId as string].push(newItem);
    } else {
      tree.push(newItem);
    }
  });
  return tree;
};

export default flatListToHierarchical;
