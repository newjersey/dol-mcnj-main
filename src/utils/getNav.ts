export const getNav = async () => {
  const navData = await fetch(
    `${process.env.REACT_APP_SITE_URL}/api/pageData?slug=nav`
  );

  const navigation = await navData.json();

  return navigation;
};
