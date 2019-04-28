const { RESTDataSource } = require('apollo-datasource-rest');
require('dotenv').config();

export default class Deepai extends RESTDataSource {
    constructor() {
        super();
        this.key = process.env.DEEPAI_KEY;
        this.baseURL = 'https://api.deepai.org/api/';
    }


    async willSendRequest(request) {
        request.headers.set('Api-Key', this.key );
        request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

    // making an HTTP POST request
    async analyse(url) {
        return this.post(
            `demographic-recognition`, // path
            `image=${url}`, // request body
        );
    }
}