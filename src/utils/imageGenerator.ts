const imageGenerator = (url: string, width: number): string => {
  if (!url) {
    return '';
  }
  try {
    const urlObject = new URL(url.replace('https://atenews.ph', 'https://wp.atenews.ph'));
    if (urlObject.hostname !== 'wp.atenews.ph') {
      return url;
    }
    return `https://cdn.statically.io/img/${urlObject.hostname}/w=${width},f=auto${urlObject.pathname}`;
  } catch (err) {
    return url;
  }
};

export default imageGenerator;
