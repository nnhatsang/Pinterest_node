import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class nguoi_dung extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    nguoi_dung_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "email"
    },
    matkhau: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hoten: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tuoi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    anh_dai_dien: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'nguoi_dung',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nguoi_dung_id" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
  }
}
