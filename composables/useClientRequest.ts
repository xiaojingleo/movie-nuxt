type FetchType = typeof $fetch
type FetchOptions = Parameters<FetchType>[1]

// 判断是不是数组的方法在useServerRequest中也有，
// 所以我可以创建一个文件`mkdir utils && touch utils/tool.ts`放到其中
function isArray(str: unknown) {
  return Object.prototype.toString.call(str) === '[object Array]'
}

export const useClientRequest = <T= unknown>(url: string, opts?: FetchOptions) => {
  const token = useCookie<string>('token')
  const runtimeConfig = useRuntimeConfig()

  const defaultOptions: FetchOptions = {
    baseURL: runtimeConfig.public.baseUrl,
    onRequest({ options }) {
      options.headers = (options.headers || {}) as { [key: string]: string }
      if (token.value) {
        options.headers.Authorization = 'Bearer ' + token.value
      }
    },
    onResponse({ response }) {
      console.log(response)
      if (+response.status === 200 && +response._data.code !== 200) {
        ElMessage.error(response._data.msg)
      }
    },
    onResponseError({ response }) {
      ElMessage.error(isArray(response._data.msg) ? response._data.msg[0] : response._data.msg)
    },
  }

  return $fetch<T>( url, {...defaultOptions, ...opts})
}