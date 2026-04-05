import apiClient from '../lib/apiClient'

export const getAllDiscounts = async () => {
  const response = await apiClient.get('/discounts')
  return response.data
}

export const createDiscount = async (data) => {
  const response = await apiClient.post('/discounts', data)
  return response.data
}

export const updateDiscount = async (id, data) => {
  const response = await apiClient.put(`/discounts/${id}`, data)
  return response.data
}

export const deleteDiscount = async (id) => {
  const response = await apiClient.delete(`/discounts/${id}`)
  return response.data
}

export const checkDiscountByCode = async (code, orderAmount) => {
  const response = await apiClient.get(`/discounts/check/${encodeURIComponent(code)}`, {
    params: { orderAmount },
  })
  return response.data
}

export const applyDiscountToOrder = async (orderId, code) => {
  const response = await apiClient.post('/discounts/apply', { orderId, code })
  return response.data
}
