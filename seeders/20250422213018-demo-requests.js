'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'requests',
      [
        // ── ORIGINAL TWO ENTRIES ──────────────────────────────────────────────────
        {
          id: uuidv4(),
          userId: '39401580-80e1-4252-9c4f-72706c4ca7ba',
          departmentId: '845d6d44-eeeb-4500-a0cd-c82b4d813bb3',
          materialCount: 4,
          laborCount: 2,
          equipmentCount: 1,
          status: 'Pending',
          laborIds: Sequelize.literal(
            `ARRAY[
              'f1a1b1c1-d111-4aaa-aaaa-111111111111',
              'f2a2b2c2-d222-4bbb-bbbb-222222222222'
            ]::uuid[]`
          ),
          materialIds: Sequelize.literal(
            `ARRAY[
              'a1d2c3b4-1111-4aaa-aaaa-000000000001',
              'b2e3d4c5-2222-4bbb-bbbb-000000000002',
              'c3f4e5d6-3333-4ccc-cccc-000000000003',
              '${uuidv4()}'
            ]::uuid[]`
          ),
          equipmentIds: Sequelize.literal(
            `ARRAY[
              'c1a1f97a-0f62-4f68-9d3e-1a04ffb10001'
            ]::uuid[]`
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          userId: 'dbd5ace7-549a-4173-9a5b-83e930029835',
          departmentId: 'cd270592-6e69-43d2-98ea-89aee4e01e51',
          materialCount: 0,
          laborCount: 5,
          equipmentCount: 2,
          status: 'In Progress',
          laborIds: Sequelize.literal(
            `ARRAY[
              ${Array(5).fill().map(() => `'${uuidv4()}'`).join(',')}
            ]::uuid[]`
          ),
          materialIds: Sequelize.literal(`ARRAY[]::uuid[]`),
          equipmentIds: Sequelize.literal(
            `ARRAY[
              'd2b2f97b-0a73-4b68-9c2f-2b15aab20002',
              'e3c3f97c-0b84-4c78-9e3d-3c26bbc30003'
            ]::uuid[]`
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // ── NEW ENTRY #3 ─────────────────────────────────────────────────────────
        {
          id: '3a1a1b1c-aaaa-4aaa-aaaa-333333333333',
          userId: 'd51a1fcf-6ec8-4079-acb8-ea9701997fd0',
          departmentId: 'cd270592-6e69-43d2-98ea-89aee4e01e51',
          materialCount: 1,
          laborCount: 1,
          equipmentCount: 1,
          status: 'Pending',
          laborIds: Sequelize.literal(
            `ARRAY['f1a1b1c1-d111-4aaa-aaaa-111111111111']::uuid[]`
          ),
          materialIds: Sequelize.literal(
            `ARRAY['a1d2c3b4-1111-4aaa-aaaa-000000000001']::uuid[]`
          ),
          equipmentIds: Sequelize.literal(
            `ARRAY['c1a1f97a-0f62-4f68-9d3e-1a04ffb10001']::uuid[]`
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // ── NEW ENTRY #4 ─────────────────────────────────────────────────────────
        {
          id: '4a2a2b2c-aaaa-4aaa-aaaa-444444444444',
          userId: 'd51a1fcf-6ec8-4079-acb8-ea9701997fd0',
          departmentId: null,
          materialCount: 1,
          laborCount: 1,
          equipmentCount: 1,
          status: 'In Progress',
          laborIds: Sequelize.literal(
            `ARRAY['f2a2b2c2-d222-4bbb-bbbb-222222222222']::uuid[]`
          ),
          materialIds: Sequelize.literal(
            `ARRAY['b2e3d4c5-2222-4bbb-bbbb-000000000002']::uuid[]`
          ),
          equipmentIds: Sequelize.literal(
            `ARRAY['d2b2f97b-0a73-4b68-9c2f-2b15aab20002']::uuid[]`
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // ── NEW ENTRY #5 ─────────────────────────────────────────────────────────
        {
          id: '5a3a3b3c-aaaa-4aaa-aaaa-555555555555',
          userId: '39401580-80e1-4252-9c4f-72706c4ca7ba',
          departmentId: null,
          materialCount: 1,
          laborCount: 1,
          equipmentCount: 1,
          status: 'Completed',
          laborIds: Sequelize.literal(
            `ARRAY['f3a3b3c3-d333-4ccc-cccc-333333333333']::uuid[]`
          ),
          materialIds: Sequelize.literal(
            `ARRAY['c3f4e5d6-3333-4ccc-cccc-000000000003']::uuid[]`
          ),
          equipmentIds: Sequelize.literal(
            `ARRAY['e3c3f97c-0b84-4c78-9e3d-3c26bbc30003']::uuid[]`
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('requests', null, {});
  },
};
