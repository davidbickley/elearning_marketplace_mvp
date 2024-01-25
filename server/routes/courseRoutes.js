import express from 'express';
import { isInstructor, requireSignin, isEnrolled } from '../middlewares/index.js';
import { 
    createCourse, 
    readCourse, 
    updateCourse, 
    addLesson, 
    removeLesson, 
    updateLesson, 
    publishCourse, 
    unpublishCourse, 
    listCourses, 
    checkEnrollment,
    freeEnrollment,
    paidEnrollment,
    stripeSuccess, 
    userCourses,
    markCompleted,
    markIncomplete,
    listCompleted, 
} from '../controllers/courseControllers.js';

const router = express.Router();

router.get('/courses', listCourses)
router.post('/course', requireSignin, isInstructor, createCourse, readCourse);

router.get('/course/:slug', readCourse)
router.patch('/course/:slug', requireSignin, isInstructor, updateCourse);
router.put('/course/:slug/:lessonId', requireSignin, isInstructor, removeLesson);

router.post('/course/lesson/:slug/:instructorId', requireSignin, addLesson)
router.patch('/course/lesson/:slug/:instructorId', requireSignin, updateLesson)

router.patch('/course/publish/:courseId', requireSignin, publishCourse)
router.patch('/course/unpublish/:courseId', requireSignin, unpublishCourse)

// Enrollment
router.get('/check-enrollment/:courseId', requireSignin, checkEnrollment)
router.get('/stripe-success/:courseId', requireSignin, stripeSuccess)
router.post('/free-enrollment/:courseId', requireSignin, freeEnrollment)
router.post('/paid-enrollment/:courseId', requireSignin, paidEnrollment)

router.get('/user-courses', requireSignin, userCourses)
router.get('/user/course/:slug', requireSignin, isEnrolled, readCourse)

router.post("/mark-completed", requireSignin, markCompleted);
router.post("/mark-incomplete", requireSignin, markIncomplete);
router.post("/list-completed", requireSignin, listCompleted);

export default router