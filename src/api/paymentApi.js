// Vị trí: src/api/paymentApi.js
import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "../constants/api";

/**
 * Tạo URL thanh toán VNPay cho 1 đơn hàng
 * BE trả về { paymentUrl: "https://sandbox.vnpayment.vn/..." }
 */
export const createPayment = (orderId) =>
  axiosInstance.post(`${ENDPOINTS.PAYMENT_CREATE}?orderId=${orderId}`);
