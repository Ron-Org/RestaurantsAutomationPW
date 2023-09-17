import { request } from '@playwright/test'
import { Restaurant } from './API-Request/get-restaurants-request'

const postRequest = async (url: string, data?: any) => {
  const context = await request.newContext()
  return await context.post(url, {
    data: data ? data : '',
  })
}

const getRequestById = async (url: string, param?: any) => {
  const context = await request.newContext()
  return await context.get(url, {
    params: {
      id: param,
    },
  })
}

const getRequest = async (url: string) => {
  const context = await request.newContext()
  return await context.get(url)
}

const deleteRequest = async (url: string, param?: any) => {
  const context = await request.newContext()
  return await context.delete(url + param.toString())
}

const patchRequest = async (url: string, data?: any, param?: any) => {
  const context = await request.newContext()
  return await context.patch(url + param.toString(), {
    data: data ? data : '',
  })
}

export { postRequest, getRequest, getRequestById, deleteRequest, patchRequest }
