import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class QdrantCustomizedApi implements ICredentialType {
	name = 'QdrantCustomizedApi';
	displayName = 'Qdrant Customized Credentials API';
	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
		{
			displayName: 'API Url',
			name: 'apiUrl',
			type: 'string',
			default: '',
		},
	];

	// This credential is currently not used by any node directly
	// but the HTTP Request node can use it to make requests.
	// The credential is also testable due to the `test` property below
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				"api-key": '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			headers: {
				accept: 'application/json; charset=utf-8',
			},
		},
	};
}
