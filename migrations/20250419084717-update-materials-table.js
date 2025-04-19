"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable("materials");

    // 1) DROP old legacy columns if they exist (customize these if needed)
    if (tableDesc.total_material) {
      await queryInterface.removeColumn("materials", "total_material");
    }
    if (tableDesc.unit_price) {
      await queryInterface.removeColumn("materials", "unit_price");
    }

    // 2) ADD ILabor-style fields if not present
    if (!tableDesc.activityId) {
      await queryInterface.addColumn("materials", "activityId", {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "activities", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (!tableDesc.requestId) {
      await queryInterface.addColumn("materials", "requestId", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "requests", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (!tableDesc.warehouseId) {
      await queryInterface.addColumn("materials", "warehouseId", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "warehouses", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (!tableDesc.item) {
      await queryInterface.addColumn("materials", "item", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableDesc.unit) {
      await queryInterface.addColumn("materials", "unit", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableDesc.requestQuantity) {
      await queryInterface.addColumn("materials", "requestQuantity", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!tableDesc.minQuantity) {
      await queryInterface.addColumn("materials", "minQuantity", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!tableDesc.rate) {
      await queryInterface.addColumn("materials", "rate", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });
    }

    if (!tableDesc.totalAmount) {
      await queryInterface.addColumn("materials", "totalAmount", {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      });
    }

    // 3) OPTIONAL: Backfill data here if needed
    // await queryInterface.sequelize.query(`
    //   UPDATE materials
    //   SET item = 'Unknown',
    //       unit = 'unit',
    //       requestQuantity = 0,
    //       minQuantity = 0,
    //       rate = 0.00,
    //       totalAmount = 0.00
    //   WHERE item IS NULL;
    // `);

    // 4) Make previously added fields NOT NULL
    await queryInterface.changeColumn("materials", "requestId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "requests", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("materials", "warehouseId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "warehouses", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("materials", "item", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("materials", "unit", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("materials", "requestQuantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn("materials", "minQuantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn("materials", "rate", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.changeColumn("materials", "totalAmount", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable("materials");

    for (const col of [
      "totalAmount",
      "rate",
      "minQuantity",
      "requestQuantity",
      "unit",
      "item",
      "warehouseId",
      "requestId",
      "activityId",
    ]) {
      if (tableDesc[col]) {
        await queryInterface.removeColumn("materials", col);
      }
    }

    // Recreate legacy fields if needed
    if (!tableDesc.total_material) {
      await queryInterface.addColumn("materials", "total_material", {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }

    if (!tableDesc.unit_price) {
      await queryInterface.addColumn("materials", "unit_price", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      });
    }
  },
};
