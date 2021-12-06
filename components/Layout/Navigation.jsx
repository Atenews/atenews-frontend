import React from 'react';
import { useRouter } from 'next/router';

import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Menu from '@/components/Layout/Menu';

import SubMenu from '@/components/Layout/SubMenu';
import { useCategory } from '@/utils/hooks/useCategory';

import postFetch from '@/utils/postFetch';

const useStyles = makeStyles(() => ({
  container: {
    position: 'fixed',
    zIndex: 1500,
  },
  logo: {
    backgroundImage: 'url("/logo.png")',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '80%',
    width: 65,
    height: 65,
    margin: 'auto',
  },
  submenu: {
    position: 'absolute',
    right: 'calc(-15vw - 10px)',
    top: 0,
    width: '15vw',
    borderRadius: 10,
    overflow: 'hidden',
    minHeight: 65,
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();
  const { category, categories } = useCategory();

  const [activeMenu, setActiveMenu] = React.useState('/');
  const [menus, setMenus] = React.useState([]);
  const [menuLoading, setMenuLoading] = React.useState(true);

  const baseUrlMenu = (url) => (url !== '/' ? `${url.split('/').slice(0, 2).join('/')}` : '/');

  const flatListToHierarchical = (
    data = [],
    { idKey = 'id', parentKey = 'parentId', childrenKey = 'children' } = {},
  ) => {
    const tree = [];
    const childrenOf = {};
    data.forEach((item) => {
      const newItem = { ...item };
      const { [idKey]: id, [parentKey]: parentId = 0 } = newItem;
      childrenOf[id] = childrenOf[id] || [];
      newItem[childrenKey] = childrenOf[id];
      if (parentId) {
        childrenOf[parentId] = childrenOf[parentId] || [];
        childrenOf[parentId].push(newItem);
      } else {
        tree.push(newItem);
      }
    });
    return tree;
  };

  React.useEffect(() => {
    setMenuLoading(true);
    postFetch('/api/graphql/getMenus').then((res) => res.json()).then((x) => {
      setMenus(flatListToHierarchical(x.menus));
      setMenuLoading(false);
    });
  }, []);

  React.useEffect(() => {
    setActiveMenu(baseUrlMenu(router.pathname));
  }, [router.pathname, category]);

  const isActiveCondition = (menu) => {
    const isListPage = window.location.href.split('/')[4] === menu.url.split('/')[4];
    const slugs = [];
    slugs.push(menu.url.split('/').pop());
    menu.children.forEach((child) => {
      slugs.push(child.url.split('/').pop());
    });
    const isArticle = slugs.includes(category[0]?.slug);
    return isListPage || isArticle;
  };

  const handleClick = (url) => {
    router.push(url);
  };

  const logoGenerator = () => {
    if (activeMenu === '/' || activeMenu === '/profile' || activeMenu === '/auth') {
      return 'url("/logo.png")';
    }
    if (theme.palette.mode === 'dark') {
      return 'url("/logo.png")';
    }
    return 'url("/logo-blue.png")';
  };

  return (
    <div className={classes.container}>
      <Menu
        color={theme.palette.primary.main}
        label={(
          <div
            className={classes.logo}
            style={
              {
                backgroundImage: logoGenerator(),
              }
            }
          />
        )}
        active={activeMenu === '/' || activeMenu === '/profile' || activeMenu === '/auth'}
        onClick={() => handleClick('/')}
      />
      { !menuLoading ? (
        <>
          {menus.map((menu) => (
            <Menu
              key={menu.id}
              color={categories.find((cat) => menu.url.split('/').pop() === cat.slug)?.description || theme.palette.atenews.main}
              label={<Typography variant="body1">{menu.label}</Typography>}
              active={isActiveCondition(menu)}
              onClick={() => handleClick(menu.url.replace('https://atenews.ph', ''))}
            >
              <div className={classes.submenu}>
                {menu.children.map((child) => (
                  <SubMenu key={child.id} label={<Typography variant="body1">{child.label}</Typography>} color={categories.find((cat) => child.url.split('/').pop() === cat.slug)?.description || theme.palette.atenews.main} onClick={() => handleClick(child.url.replace('https://atenews.ph', ''))} />
                ))}
              </div>
            </Menu>
          ))}

          <Menu
            color={theme.palette.primary.main}
            label={<Typography variant="body1">Staff</Typography>}
            active={activeMenu === '/staff'}
            onClick={() => handleClick('/staff')}
          />
        </>
      ) : null }
    </div>
  );
}
