import api from './axios';

export const fetchCurrentUser = async () => {
  try {
    const res = await api.get('/auth/status');
    return res.data.user;
  } catch (err) {
    return null;
  }
};
