const { RESTDataSource } = require('apollo-datasource-rest');

export default class GenderML extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://192.168.99.100:5000/';
    }


    // making an HTTP POST request
    async detect(url) {
        return this.get(
            `detect`, // path
            `url=${url}&gender=on&landmarks=off`, // request body
        );
    }
}