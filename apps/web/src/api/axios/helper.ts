import { isObject } from 'lodash-es';

export function joinTimestamp<T extends boolean>(join: boolean, restful: T): T extends true ? string : object;

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
    let parameters = '';
    for (const key in obj) {
      parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
    }
    parameters = parameters.replace(/&$/, '');
    return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
  }



export function checkStatus(status: number, msg: string): void {

    let errMessage = '';
    switch (status) {
      case 400:
        errMessage = `${msg}`;
        break;
      // 401: Not logged in
      // Jump to the login page if not logged in, and carry the path of the current page
      // Return to the current page after successful login. This step needs to be operated on the login page.
      case 401:
        break;
      case 403:
        errMessage = '用户得到授权，但是访问是被禁止的。!';
        break;
      // 404请求不存在
      case 404:
        errMessage = '网络请求错误,未找到该资源!';
        break;
      case 405:
        errMessage = '网络请求错误,请求方法未允许!';
        break;
      case 408:
        errMessage = '网络请求超时!';
        break;
      case 500:
        errMessage = '服务器错误,请联系管理员!';
        break;
      case 501:
        errMessage = '网络未实现!';
        break;
      case 502:
        errMessage = '网络错误!';
        break;
      case 503:
        errMessage = '服务不可用，服务器暂时过载或维护!';
        break;
      case 504:
        errMessage = '网络超时!';
        break;
      case 505:
        errMessage = 'http版本不支持该请求!';
        break;
      default:
    }
  }

  export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
    let key: string;
    for (key in target) {
      src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
  }