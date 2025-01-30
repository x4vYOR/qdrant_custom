import { IDataObject, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import fetch from 'node-fetch';
export class QdrantCustomized implements INodeType {
    
	description: INodeTypeDescription = {
		displayName: 'Qdrant Custom',
        name: 'QdrantCustomized',
        icon: 'file:qdrant-icon.svg',
        group: ['transform'],
        version: 1,
        subtitle: 'Set Qdrant properties',
        description: 'Get documents from Qdrant',
        defaults: {
            name: 'Qdrant Custom',
        },
        inputs: ['main'] as Array<NodeConnectionType>,
        outputs: ['main'] as Array<NodeConnectionType>,
        credentials: [
            {
                name: 'QdrantCustomizedApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: '{{$credentials.apiUrl}}',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
		properties: [
            {
                displayName: 'Collection Name',
                name: 'collectionName',
                type: 'string',
                default: '',
                required: true,
                description: 'The name of collection in Qdrant'
            },
            // Operations will go here
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                default: 4,
                required: true,
                description: 'Max number of results to return'
            },
            {
                displayName: 'Vector Input',
                name: 'queryVector',
                type: 'string',
                default: '',
                required: true,
                description: 'Vector query to search'
            },
            {
                displayName: 'With Metadata',
                name: 'withMetadata',
                type: 'boolean',
                default: true,
                required: true,
                description: 'Whether return metadata with the response'
            },
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                default: {},
                placeholder: 'Add Field',
                options: [
                    {
                        displayName: 'Content Index',
                        name: 'index',
                        type: 'string',
                        default: 'page_content',
                        placeholder: 'page_content',
                        description: 'The name of content with original data'
                    }
                ],									
            }
        ]
    };
    
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const credentials = await this.getCredentials('QdrantCustomizedApi');
        const apiKey = credentials.apiKey;
        const apiUrl = credentials.apiUrl;
        //console.log("apiUrl: ", apiUrl);
        const queryVector = this.getNodeParameter('queryVector',0);
        const limit = this.getNodeParameter('limit',0);
        const withMetadata = this.getNodeParameter('withMetadata',0);
        //const index = this.getNodeParameter('index',0);
        const collectionName = this.getNodeParameter('collectionName', 0) as string;
    
        const returnData = [];
        const response = await fetch(`${apiUrl}/collections/${collectionName}/points/search`, {
              method: 'POST',
              headers: {
                'api-key': `${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                vector: queryVector,
                limit: limit,
                with_payload: withMetadata
              }),
            });
            const data = await response.json();
            returnData.push({ json: data });
        return [this.helpers.returnJsonArray(returnData as IDataObject[])];
      }
}