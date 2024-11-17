import axios from 'axios';
  

async function sendPostRequest(imageUrls) {
  try {
    const response = await axios.post('http://localhost:5000', { imageUrls });
    console.log("request success")
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

const imageUrls = [
    "https://www.boredpanda.com/blog/wp-content/uploads/2022/02/clipimage-62036e125f6e3__700.jpg",
    "https://cdn.osxdaily.com/wp-content/uploads/2018/08/save-iphone-messages-screenshot-method-2-369x800.jpeg",
    "https://cdn.osxdaily.com/wp-content/uploads/2018/08/save-iphone-messages-screenshot-method-2-369x800.jpeg",
    // Add more URLs if needed
  ];


sendPostRequest(imageUrls);
