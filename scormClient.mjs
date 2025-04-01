import { default as ScormCloud } from '@rusticisoftware/scormcloud-api-v2-client-javascript';

const API_KEY_ID = process.env.API_KEY_ID;
const API_SECRET = process.env.API_SECRET;

export class ScormCloudClient {
    constructor() {
        ScormCloud.ApiClient.instance.authentications['APP_NORMAL'].username = API_KEY_ID;
        ScormCloud.ApiClient.instance.authentications['APP_NORMAL'].password = API_SECRET;

        this.registrationApi = new ScormCloud.RegistrationApi();
        this.learnerApi = new ScormCloud.LearnerApi();
        this.coursesApi = new ScormCloud.CourseApi();
    }

    async paginatedFetch(fetch, dataKey) {
        return await Array.fromAsync({
            async *[Symbol.asyncIterator]() {
                let nextFetch = undefined;

                do {
                    const data = await fetch({more: nextFetch});

                    for (const registration of data[dataKey]) {
                        yield registration;
                    }

                    nextFetch = data.more;
                } while (!!nextFetch);
            }
        });
    }

    async getRegistrations() {
        const fetch = (params) => new Promise((resolve, reject) => {
            this.registrationApi.getRegistrations(params, (error, data) => {
                if (error) {
                    reject(error?.response.body);
                } else {
                    resolve(data);
                }
            });
        })        

        return await this.paginatedFetch(fetch, 'registrations');
    }

    async getCourses() {
        const fetch = (params) => new Promise((resolve, reject) => {
            this.coursesApi.getCourses(params, (error, data) => {
                if (error) {
                    reject(error?.response.body);
                } else {
                    resolve(data)
                }
            })
        })

        return await this.paginatedFetch(fetch, 'courses');
    }
}