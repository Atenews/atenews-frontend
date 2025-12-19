const imageGenerator = (url: string, width: number): string => {
  if (!url) {
    return '';
  }
  try {
    const urlObject = new URL(url.replace('https://atenews.ph', 'https://wp.atenews.ph'));
    return `${urlObject.origin}${urlObject.pathname}?w=${width}&f=auto`;
    
  } catch (err) {
    return url;
  }
};

export default imageGenerator;
