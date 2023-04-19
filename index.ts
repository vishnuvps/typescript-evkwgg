// Import stylesheets
import './style.css';
import FormData from 'form-data';
import * as fs from 'fs';
export enum ApiReferenceSourceType {
  URL,
  FileUpload,
  CommandLine,
}
export enum ApiReferenceOperationType {
  Import,
  Update,
  Resync,
}
export interface ResponseError {
  description: string;
  errorCode: string;
  extensionData: string;
  stackTrace: string;
}
export class BaseResponse {
  success: boolean;
  information: unknown[];
  errors: ResponseError[];
  warnings: unknown[];
}

export class ApiResponse<T> extends BaseResponse {
  result: T;
}
export interface ImportApiReferenceSummary {
  rootCategoryId: string;
  projectId: string;
  projectDocumentVersionId: string;
  categoriesCreated: number;
  articlesCreated: number;
  isApiDefinitionImported: boolean;
  errors: LogMessageAndPointer[];
  warnings: LogMessageAndPointer[];
  isSuccess: boolean;
  apiDefinitionsCount: number;
  apiDefinitionId?: string;
  isServerAvailable: boolean;
}

export interface LogMessageAndPointer {
  logMessage: string;
  logPointer: string;
}
// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

const formData = new FormData();
//const stream = fs.readFileSync('file/Definition.json', 'utf8');
formData.append(
  'url',
  'https://apidocslogs.blob.core.windows.net/upload-swaggersample/Definition.json'
);
formData.append('apiReferenceId', '39dc2684-467f-484f-8019-52bbcf44af39');
formData.append('sourceType', ApiReferenceSourceType.CommandLine);
formData.append('operationType', ApiReferenceOperationType.Resync);
formData.append('ciName', 'command-line');
formData.append('proceedAnyway', 'true');
const requestOptions = {
  method: 'POST',
  body: formData,
  headers: new Headers({
    api_token:
      'klhgeGoqB8wlUwq2hraJ1wyda0tPZcU345/goWCgHueWyteXbhIHbcTVzeQeap45ypRBoHwrzt77WEnqdhngXybasZXgcqx2K8HE/Bi7Ki2CT99QsS5QtdUtZQhgwpBANA8nK0Pocz1R0xmcy5mVaw==',
  }),
};
let requestUrl =
  '/v2/apidocs/39dc2684-467f-484f-8019-52bbcf44af39/resync/b20f1211-e41d-4bc5-bd7d-199405fbf12b';
const response = d360APIFetch<ApiResponse<ImportApiReferenceSummary>>(
  requestUrl,
  requestOptions
);
export default async function d360APIFetch<T>(
  path: string,
  options: RequestInit = { headers: new Headers() }
): Promise<T> {
  let baseUrl: string;
  //const currentEnvironment = 'https://localhost:44380';
  baseUrl = 'https://localhost:44380';

  const url = `${baseUrl}${path}`;
  let headers = options.headers as Headers;
  if (!(options.headers instanceof Headers)) {
    headers = new Headers(options.headers);
  }
  return fetch(url, {
    ...options,
    headers,
  }).then((response) => {
    if (!response.ok) {
      response.text().then((responseText) => {
        console.log(response);
        if (response.status == 401) {
          console.log(`Error 401: Unauthorized. ${responseText}`);
        } else {
          const parsedResponse = JSON.parse(responseText) as ApiResponse<T>;
          console.log(
            `Error ${response.status}: ${response.statusText} ${parsedResponse.errors[0].description}`
          );
        }
      });
      return;
    }
    return response.json() as Promise<T>;
  });
}
