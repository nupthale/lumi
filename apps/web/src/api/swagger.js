import path from 'path';
import swagger from 'free-swagger';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const defaultConfig = {
  lang: 'ts',
  jsDoc: false,
  chooseAll: true,
  filename(name) {
    console.info(name);

    name = name.replace(/Controller$/, '').replace(/^wealth/, '');
    return `${name[0].toLowerCase()}${name.slice(1)}`;
  },
};

const bastPath = '/';
const basePathReg = new RegExp(`^${bastPath}`);
const firstToUpper = (s) => (s ? s[0].toUpperCase() + s.substr(1) : '');

// 常出现在URL中的TS关键字
const tsKeywordSet = new Set(['delete']);

const getApiName = (method, url) => {
  url = url
    .replace(basePathReg, '')
    .replace(/{(.*?)}/g, (_, $1) => ($1 ? `by${firstToUpper($1)}` : 'byParam'))
    .replace(/[\-_.](.)/g, (_, $1) => firstToUpper($1));

  const pathArr = url.split('/');
  if (pathArr[0] === '') {
    pathArr.shift();
  }
  // 如果后面的URL中包含了前缀，生成的函数名就不包含前缀，避免函数名太长
  // 函数名超过20个字符时也去掉前缀
  // 例如 /abc/updateAbc 改成 updateApi
  const prefixReg = new RegExp(pathArr[0], 'i');
  let length = 0;
  for (let i = pathArr.length - 1; i >= 0; --i) {
    if (length + pathArr[i].length >= 20 || (i > 0 && prefixReg.test(pathArr[i]))) {
      pathArr.shift();
      break;
    }
    length += pathArr[i].length;
  }

  // 避免出现类似 getGetList 这种情况
  const methodReg = new RegExp(`^${method}${method}`, 'i');
  const apiName = (
    method +
    pathArr.reduce((res, curr) => {
      return res + firstToUpper(curr);
    }, '')
  ).replace(methodReg, method);

  return tsKeywordSet.has(apiName) ? `${apiName}Api` : apiName;
};

const templateFunction = ({
  url,
  summary,
  method,
  // name,
  responseType,
  deprecated,
  pathParams,
  IResponse,
  IQueryParams,
  IBodyParams,
  IPathParams,
}) => {
  // 处理路径参数
  // `/pet/{id}` => `/pet/${id}`
  const parsedUrl = url.replace(/{(.*?)}/g, '${$1}');

  const onlyIQueryParams = IQueryParams && !IBodyParams;
  const onlyIBodyParams = IBodyParams && !IQueryParams;
  const multipleParams = IQueryParams && IBodyParams;

  const apiName = getApiName(method, url);

  return `
    ${deprecated ? '/**deprecated*/' : ''}
    ${summary ? `// ${summary}` : ''}
    export const ${apiName} = (${
      onlyIQueryParams
        ? `params: ${IQueryParams},`
        : onlyIBodyParams
          ? `params: ${IBodyParams},`
          : multipleParams
            ? `queryParams: ${IQueryParams},` // no params
            : IPathParams
              ? 'params: {[key:string]: never},'
              : ''
    }${pathParams.length ? `{${pathParams.join('', '')}}: ${IPathParams},` : multipleParams ? 'pathParams: {[key:string]: never},' : ''}${
      multipleParams ? `bodyParams: ${IBodyParams}` : ''
    }${' options: RequestOptions = {}'}) => {
        return defHttp.request<${IResponse || 'any'}>({
          url: \`${parsedUrl.slice(1)}\`,
          method: '${method}',
          params: ${multipleParams ? 'queryParams' : IQueryParams ? 'params' : '{}'},
          data: ${multipleParams ? 'bodyParams' : IBodyParams ? 'params' : '{}'},
          ${responseType === 'json' ? '' : `responseType: ${responseType},`}
        }, options);
      }`;
};

const fetchSwagger = () => {
  // 读取 swagger JSON 文件
  const apiSourcePath = path.resolve(__dirname, '../../../server-api/swagger/swagger-output.json');
  const apiSource = JSON.parse(fs.readFileSync(apiSourcePath, 'utf8'));
  
  swagger({
    ...defaultConfig,
    // 测试环境
    source: apiSource,
    // 寿保
    // source: `http://10.53.188.46:9602/wealth-ops-api/v2/api-docs?group=财富业务运营管理系统`,
    // cookie,
    root: path.resolve(__dirname, './api'),
    header: "import { defHttp } from '../axios/http'; import type { RequestOptions } from '../axios/interface';",
    templateFunction,
  });
};

fetchSwagger();