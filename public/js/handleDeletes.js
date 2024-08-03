import axios from 'axios';
import { showAlert } from './alert';

export const deleteItem = async (type, id) => {
  try {
    const res = await axios.delete(`${req.protocol}://${req.get('host')}/api/v1/${type}/${id}`);
    if (res.status === 204) {
      showAlert('success', `${type} deleted successfully!`);
      // Optionally, remove the deleted item from the DOM
      const itemElement = document.querySelector(`.${type}[data-id="${id}"]`);
      if (itemElement) {
        itemElement.remove();
      } else {
        console.error(`Element with selector .${type}[data-id="${id}"] not found in the DOM.`);
      }
    } else {
      showAlert('error', `Failed to delete the ${type}`);
    }
  } catch (err) {
    showAlert('error', `Failed to delete the ${type}`);
  }
};
