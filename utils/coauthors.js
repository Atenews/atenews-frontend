const coauthors = (array) => array.map((author, i) => {
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
