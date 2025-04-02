import { ScormCloudClient } from "./scormClient.mjs";
import { sequelize } from "./models/connection.mjs";
import { Learner } from "./models/learners.mjs";
import { Course } from "./models/courses.mjs";
import { Registration } from "./models/registrations.mjs";
import { Tag } from './models/tags.mjs';

async function main() {
    await sequelize.sync({ force: true });

    const scormClient = new ScormCloudClient();
    const registrations = await scormClient.getRegistrations();
    const courses = await scormClient.getCourses();

    for (const course of courses) {
        const [courseModel, courseCreated] = await Course.upsert({
            courseId: course.id,
            title: course.title,
            created: course.created,
            updated: course.updated,
            version: course.version,
            activityId: course.activityId,
            courseLearningStandard: course.courseLearningStandard,
            tags: (course.tags || []).map(tag => ({ name: tag })),
            raw: course
        }, {include: [Tag]});

        console.log(`--- Course ${courseCreated ? 'Created' : 'Updated'}: ${courseModel.uuid}`);
    }

    for (const registration of registrations) {
        const courseId = registration.course.id;
        const courseModel = await Course.findOne({where: { courseId }});

        const [learnerModel, learnerCreated] = await Learner.upsert({
            learnerId: registration.learner.id,
            firstName: registration.learner.firstName,
            lastName: registration.learner.lastName,
        })

        console.log(`--- Learner ${learnerCreated ? 'Created' : 'Updated'}: ${learnerModel.uuid}`);

        const [registrationModel, registrationCreated] = await Registration.upsert({
            registrationId: registration.id,
            instance: registration.instance,
            updated: registration.updated,
            registrationCompletion: registration.registrationCompletion,
            registrationCompletionAmount: registration.registrationCompletionAmount,
            registrationSuccess: registration.registrationSuccess,
            score: registration.score?.scaled || null,
            totalSecondsTracked: registration.totalSecondsTracked,
            firstAccessDate: registration.firstAccessDate,
            lastAccessDate: registration.lastAccessDate,
            completedDate: registration.completedDate,
            createdDate: registration.createdDate,
            tags: (registration.tags || []).map(tag => ({ name: tag })),
            raw: registration,
            learnerId: learnerModel.uuid,
            courseId: courseModel.uuid,
        }, {include: [Tag]});

        console.log(`--- Registration ${registrationCreated ? 'Created' : 'Updated'}: ${registrationModel.uuid}`);
    }
}

await main();