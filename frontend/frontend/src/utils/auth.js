export const getToken = () => localStorage.getItem('token');

export const getUser = () =>
  JSON.parse(localStorage.getItem('user') || 'null');

export const setSession = (data, user) => {
  localStorage.setItem('token', data.accessToken);
  localStorage.setItem('tokenType', data.tokenType);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenType');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => !!getToken();

export const hasRole = (role) => {
  const user = getUser();
  return user?.roles?.includes(role) ?? false;
};