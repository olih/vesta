import axios from 'axios'

const callweb = async () => {
  try {
    const response = await axios.get('http://flarebyte.com/')
    console.log(response.data);
  } catch (error) {
    console.log(error.response.body);
  }
};

export { callweb };
