"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // describe existing columns
    const tableDesc = await queryInterface.describeTable("labors");

    // 1) DROP legacy columns if they exist
    if (tableDesc.total_labor) {
      await queryInterface.removeColumn("labors", "total_labor");
    }
    if (tableDesc.hourly_rate) {
      await queryInterface.removeColumn("labors", "hourly_rate");
    }

    // 2) ADD your ILabor columns as NULLABLE
    if (!tableDesc.activity_id) {
      await queryInterface.addColumn("labors", "activity_id", {
        type: Sequelize.UUID,
        allowNull: false, // we can add a NOT NULL foreign key if you know every row already has a valid activity
        references: { model: "activities", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (!tableDesc.requestId) {
      await queryInterface.addColumn("labors", "requestId", {
        type: Sequelize.UUID,
        allowNull: true, // TEMPORARILY allow null so existing rows don’t break
        references: { model: "requests", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (!tableDesc.role) {
      await queryInterface.addColumn("labors", "role", {
        type: Sequelize.STRING,
        allowNull: true, // backfill, then set NOT NULL
      });
    }

    if (!tableDesc.unit) {
      await queryInterface.addColumn("labors", "unit", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableDesc.requestQuantity) {
      await queryInterface.addColumn("labors", "requestQuantity", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!tableDesc.minQuantity) {
      await queryInterface.addColumn("labors", "minQuantity", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!tableDesc.estimatedHours) {
      await queryInterface.addColumn("labors", "estimatedHours", {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      });
    }

    if (!tableDesc.rate) {
      await queryInterface.addColumn("labors", "rate", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }

    if (!tableDesc.totalAmount) {
      await queryInterface.addColumn("labors", "totalAmount", {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      });
    }

    if (!tableDesc.skill_level) {
      await queryInterface.addColumn("labors", "skill_level", {
        type: Sequelize.STRING,
        allowNull: true, // maps to `skillLevel` in your model
      });
    }

    // 3) BACKFILL existing rows here if needed, for example:
    // await queryInterface.sequelize.query(
    //   `UPDATE labors
    //      SET "role" = 'Unknown',
    //          "unit" = 'unit',
    //          "requestQuantity" = 0,
    //          "minQuantity" = 0,
    //          "estimatedHours" = 0.00,
    //          "rate" = 0.00,
    //          "totalAmount" = 0.00,
    //          "requestId" = <SOME_UUID>
    //    WHERE "requestId" IS NULL;`
    // );

    // 4) NOW ALTER each column to NOT NULL (once you’ve backfilled)
    await queryInterface.changeColumn("labors", "requestId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "requests", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("labors", "role", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("labors", "unit", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("labors", "requestQuantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("labors", "minQuantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("labors", "estimatedHours", {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn("labors", "rate", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn("labors", "totalAmount", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    });
    // skill_level can remain nullable if you wish:
    // await queryInterface.changeColumn('labors', 'skill_level',{ type: Sequelize.STRING, allowNull: true });
  },

  async down(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable("labors");

    // drop everything we added
    for (const col of [
      "skill_level",
      "totalAmount",
      "rate",
      "estimatedHours",
      "minQuantity",
      "requestQuantity",
      "unit",
      "role",
      "requestId",
      "activity_id",
    ]) {
      if (tableDesc[col]) {
        await queryInterface.removeColumn("labors", col);
      }
    }

    // re-create your legacy columns (if you still need them)
    if (!tableDesc.total_labor) {
      await queryInterface.addColumn("labors", "total_labor", {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }
    if (!tableDesc.hourly_rate) {
      await queryInterface.addColumn("labors", "hourly_rate", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      });
    }
  },
};
