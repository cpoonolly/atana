import { ScormCloudClient } from "./scormClient.mjs";
import { sequelize } from "./models/connection.mjs";
import { Learner } from "./models/learners.mjs";
import { Course } from "./models/courses.mjs";
import { Registration } from "./models/registrations.mjs";
import { Tag } from './models/tags.mjs';

async function main() {
    await sequelize.sync({ force: true });

    const scormClient = new ScormCloudClient();
    const registrations = await scormClient.getRegistrations({
        includeInteractionsAndObjectives: true,
        includeRuntime: true,
    });
    const courses = await scormClient.getCourses();

    for (const course of courses) {
        const [courseModel, courseCreated] = await Course.findOrCreate({
            where: { courseId: course.id },
            defaults: {
                courseId: course.id,
                title: course.title,
                created: course.created,
                updated: course.updated,
                version: course.version,
                activityId: course.activityId,
                courseLearningStandard: course.courseLearningStandard,
                raw: course
            }
        });

        for (const tagName of course.tags || []) {
            const [tag, _] = await Tag.findOrCreate({
                where: { name: tagName },
            });

            await courseModel.addTag(tag);
        }

        console.log(`--- Course ${courseCreated ? 'Created' : 'Loaded'}: ${courseModel.uuid}`);
    }

    for (const registration of registrations) {
        const courseId = registration.course.id;
        const courseModel = await Course.findOne({where: { courseId }});

        const [learnerModel, learnerCreated] = await Learner.findOrCreate({
            where: { learnerId: registration.learner.id },
            defaults: {
                learnerId: registration.learner.id,
                firstName: registration.learner.firstName,
                lastName: registration.learner.lastName,
                raw: registration.learner,
            }
        });

        console.log(`--- Course Loaded: ${courseModel.uuid}`);
        console.log(`--- Learner ${learnerCreated ? 'Created' : 'Loaded'}: ${learnerModel.uuid}`);

        const [registrationModel, registrationCreated] = await Registration.upsert({
            registrationId: registration.id,
            instance: registration.instance,
            updated: registration.updated,
            registrationCompletion: registration.registrationCompletion,
            registrationCompletionAmount: registration.registrationCompletionAmount,
            registrationSuccess: registration.registrationSuccess,
            totalSecondsTracked: registration.totalSecondsTracked,
            firstAccessDate: registration.firstAccessDate,
            lastAccessDate: registration.lastAccessDate,
            completedDate: registration.completedDate,
            createdDate: registration.createdDate,
            score: registration.score?.scaled || null,
            completionAmount: registration.activityDetails?.completionAmount?.scaled || null,
            attempts: registration.activityDetails?.attempts || null,
            activityCompletion: registration.activityDetails?.activityCompletion || null,
            activitySuccess: registration.activityDetails?.activitySuccess || null,
            timeTracked: registration.activityDetails?.timeTracked || null,
            suspended: registration.activityDetails?.suspended || null,
            raw: registration,
        });

        await registrationModel.setLearner(learnerModel);
        await registrationModel.setCourse(courseModel);

        for (const tagName of registration.tags || []) {
            const [tag, _] = await Tag.findOrCreate({
                where: { name: tagName },
            });

            await registrationModel.addTag(tag);
        }

        console.log(`--- Registration ${registrationCreated ? 'Created' : 'Loaded'}: ${registrationModel.uuid}`);
    }
}

await main();