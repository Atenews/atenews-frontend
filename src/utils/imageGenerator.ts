const imageGenerator = (url: string): string => {
  if (!url) {
    return '';
  }
  try {
    const urlObject = new URL(url.replace('https://atenews.ph', 'https://wp.atenews.ph'));
    return urlObject.href;
  } catch (err) {
    return url;
  }
};

export default imageGenerator;