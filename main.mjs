import { ScormCloudClient } from "./scormClient.mjs";

async function main() {
    const scormClient = new ScormCloudClient();
    const registrations = await scormClient.getRegistrations();
    const courses = await scormClient.getCourses();

    // console.log(registrations);
    console.log(courses);
}

await main();