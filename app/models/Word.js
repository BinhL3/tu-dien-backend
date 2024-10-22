const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const Word = sequelize.define('Word', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  definition: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  example: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Word;
