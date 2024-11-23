import { useFetch, UseFetchOptions } from "#app";
import { isArray} from '~/utils/tools';
import { AES_CBC_decrypt} from '~/utils/globalMethods';

export const useServerRequest = <T= unknown>(url: string, opts: UseFetchOptions<T, unknown>) => {
  const token = useCookie('token')
  const runtimeConfig = useRuntimeConfig()

  const defaultOptions: UseFetchOptions<unknown> = {
    baseURL: runtimeConfig.public.baseUrl,
    onRequest({ options }) {
      options.headers = (options.headers || {}) as { [key: string]: string }
      if (token.value) {
        options.headers.Authorization = 'Bearer ' + token.value
      }
    },
    onResponse({ response }) {
      if (+response.status === 200 && +response._data.code !== 200) {
        process.client && ElMessage.error(response._data.msg)
      }
      console.log('userServerRequest',response);
      return response
    },
    onResponseError({ response }) {
      process.client && ElMessage.error(isArray(response._data.msg) ? response._data.msg[0] : response._data.msg)
    },
  }

  return useFetch<T>( url, {...defaultOptions, ...opts} as any)
}

export const configRequest = <T= unknown>(url: string, opts: UseFetchOptions<T, unknown>) => {
  const token = useCookie('token')
  const runtimeConfig = useRuntimeConfig()

  const defaultOptions: UseFetchOptions<unknown> = {
    baseURL: runtimeConfig.public.baseUrl,
    onRequest({ options }) {
      options.headers = (options.headers || {}) as { [key: string]: string }
      if (token.value) {
        // console.log('token',token)
        options.headers.Authorization = 'Bearer ' + token.value
      }
    },
    onResponse({ response }) {
      
      // console.log("configRequest:",response);
      response._data = JSON.parse(AES_CBC_decrypt(response._data.toString().replaceAll("_","\/").replaceAll("-","+")));
      if (+response.status === 200 && +response._data.code !== 200) {
        process.client && ElMessage.error(response._data.msg)
      }
      return response;
    },
    onResponseError({ response }) {
      process.client && ElMessage.error(isArray(response._data.msg) ? response._data.msg[0] : response._data.msg)
    },
  }

  return useFetch<T>( url, {...defaultOptions, ...opts} as any)
}

export const myServerRequest = <T= unknown>(url: string, opts: UseFetchOptions<T, unknown>) => {
  const token = useCookie('token')
  const runtimeConfig = useRuntimeConfig()

  const defaultOptions: UseFetchOptions<unknown> = {
    baseURL: runtimeConfig.public.baseUrl,
    onRequest({ options }) {
      // console.log('options',options)
      options.headers = (options.headers || {}) as { [key: string]: string }
      if (token.value) {
        // console.log('token',token)
        options.headers.Authorization = 'Bearer ' + token.value
      }
    },
    onResponse({ response }) {
      if(response._data.data[0]!=undefined && response._data.data[0].title!=undefined)
      {
         response._data.data = response._data.data.filter(d=>d.title!='');
         response._data.data[0].list = response._data.data[0].list.filter(d=>d.title!='');
         
        console.log('myServerRequest _ filtered:',response);
      }
      // console.log(response._data)
      if (+response.status === 200 && +response._data.code !== 200) {
        process.client && ElMessage.error(response._data.msg)
      }
       return response;
      
    },
    onResponseError({ response }) {
      console.log('errormsg:',response._data.msg);
      process.client && ElMessage.error(isArray(response._data.msg) ? response._data.msg[0] : response._data.msg)
    },
  }

  return useFetch<T>( url, {...defaultOptions, ...opts} as any)
}