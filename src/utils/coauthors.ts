type Author = {
  firstName?: string;
  lastName?: string;
};

const coauthors = (array: Author[]) => array.map((author: Author, i: number) => {
  if (i === array.length - 2) {
    return `${author?.firstName || ''} ${author?.lastName || ''} `;
  } if (i !== array.length - 1) {
    return `${author?.firstName || ''} ${author?.lastName || ''}, `;
  } if (array.length === 1) {
    return `${author?.firstName || ''} ${author?.lastName || ''}`;
  }
  return `and ${author?.firstName || ''} ${author?.lastName || ''}`;
});

export default coauthors;
