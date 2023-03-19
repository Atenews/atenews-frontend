const Wordpress = require('wpapi');

const wp = new Wordpress({
  endpoint: 'https://wp.atenews.ph/wp-json',
});

wp.relatedPosts = wp.registerRoute('atenews/v1', '/related/(?P<id>\\d+)');
wp.usersEmail = wp.registerRoute('atenews/v1', '/user/(?P<email>[\\d\\D]+)');
wp.staffs = wp.registerRoute('atenews/v1', '/staffs');

export default wp;
