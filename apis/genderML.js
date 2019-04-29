const { RESTDataSource } = require('apollo-datasource-rest');
require('dotenv').config();

export default class GenderML extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = process.env.GENDERIZER_URL;
    }


    // making an HTTP POST request
    async detect(url) {
        return this.get(
            `detect`, // path
            `url=${url}&gender=on&landmarks=off`, // request body
        );
    }
}