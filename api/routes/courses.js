'use strict';

const express = require('express');
const { User, Course } = require('../models');
const { asyncHandler } = require('../middleware/asynchandler');
const { authenticateUser } = require('../middleware/auth-user');

// CONSTRUCT A ROUTER INSTANCE
const router = express.Router();

// GET route that will return all of a users courses
router.get(
  '/courses',
  asyncHandler(async (req, res) => {
    const course = await Course.findAll({
      include: [
        {
          model: User,
          as: 'student',
        },
      ],
    });
    res.json(course);
  })
);

// GET route that will return a users specific course
router.get(
  '/courses/:id',
  asyncHandler(async (req, res, next) => {
    const course = await Course.findAll({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: 'student',
        },
      ],
    });
    if (course) {
      res.json(course);
    } else {
      const err = new Error();
      err.status = 404;
      err.message = 'Course Not Found';
      next(err);
    }
  })
);

// POST route that will create a new course
router.post(
  '/courses',
  authenticateUser,
  asyncHandler(async (req, res) => {
    let course;
    try {
      course = await Course.create(req.body);
      res.location(`/courses/${course.id}`);
      res.status(201).end();
    } catch (error) {
      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstraintError'
      ) {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// PUT route that will update the corresponding course
router.put(
  '/courses/:id',
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    let course;

    try {
      // First find the course
      course = await Course.findByPk(req.params.id);
      // If the course exists, update
      if (course) {
        await course.update(req.body);
        res.status(204).end();
      } else {
        const err = new Error();
        err.status = 404;
        err.message = 'Course Not Found';
        next(err);
      }
    } catch (error) {
      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstraintError'
      ) {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// DELETE route that will delete the corresponding course
router.delete(
  '/courses/:id',
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    // First find the course
    const course = await Course.findByPk(req.params.id);

    // If the course exists, delete
    if (course) {
      await course.destroy();
      res.status(204).end();
    } else {
      const err = new Error();
      err.status = 404;
      err.message = 'Course Not Found';
      next(err);
    }
  })
);

module.exports = router;
