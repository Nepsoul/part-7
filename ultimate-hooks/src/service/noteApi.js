import axios from "axios";
//const baseUrl = "api/notes";

let token = null;
let setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async (baseUrl) => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject, baseUrl) => {
  const config = {
    header: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, newObject, baseUrl) => {
  const response = await axios.put(`${baseUrl}/${id} `, newObject);
  return response.data;
};

export default { getAll, create, update, setToken };
