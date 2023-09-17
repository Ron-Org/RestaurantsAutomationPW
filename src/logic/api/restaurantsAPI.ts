import jsonConfig from '../../../config.json'
import { deleteRequest, getRequest, getRequestById, patchRequest, postRequest } from '../../infra/rest/api-request'
import { Restaurant } from './API-Request/get-restaurants-request'

const baseUrl = jsonConfig.baseUrl + '/'

const getRestaurants = async () => {
  return getRequest(baseUrl + 'restaurants')
}

const resetServer = async () => {
  return postRequest(baseUrl + 'reset')
}

const createRestaurant = async (body: Restaurant) => {
  return postRequest(baseUrl + 'restaurant', body)
}

const getRestaurantById = async (id: number) => {
  return getRequestById(baseUrl + 'restaurant', id)
}

const deleteRestaurant = async (id: number) => {
  return deleteRequest(baseUrl + 'restaurant/', id)
}

const deleteAllRestaurants = async () => {
  await resetServer
  await deleteRestaurant(21)
  await deleteRestaurant(42)
  await deleteRestaurant(59)
}

const editRestaurant = async (body: object, id: number) => {
  return patchRequest(baseUrl + 'restaurant/', body, id)
}

export default { getRestaurants, resetServer, createRestaurant, getRestaurantById, deleteRestaurant, editRestaurant, deleteAllRestaurants }
