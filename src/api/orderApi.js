// Vị trí: src/api/orderApi.js
import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "../constants/api";

export const checkoutOrder = (data) => axiosInstance.post(ENDPOINTS.CHECKOUT, data);
export const getMyOrders = () => axiosInstance.get(ENDPOINTS.ORDERS);
export const getOrderById = (id) => axiosInstance.get(ENDPOINTS.ORDER_BY_ID(id));
export const cancelOrder = (id) => axiosInstance.put(`${ENDPOINTS.ORDER_BY_ID(id)}/cancel`);
