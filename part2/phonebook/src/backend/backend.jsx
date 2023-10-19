
import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

// const getAll = () => {
//   const request = axios.get(baseUrl)
//   return request.then(response => response.data)
// }

const getAll = () => {
  return axios.get(baseUrl)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

const getAllAsync = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
}


// const getAll = () => {
//   return axios.get(baseUrl)
//     .then(response => {
//       return response.data; // Return the data
//     });
// }


const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
    .then(response => {
      console.log(`Deleted post with ID ${id}`);
      return 0; // Successful deletion
    })
    .catch(error => {
      console.error('Deletion Error', error);
      return 1; // Error occurred during deletion
    });
}


export default { 
  getAll, create, update, remove, getAllAsync
}