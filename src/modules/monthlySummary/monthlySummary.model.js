

module.exports  = (sequelize, DataTypes) => {
    const MonthlySummaries = sequelize.define('MonthlySummaries', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      month: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      year: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      total_income: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_expense: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ai_summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ai_recomendation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
    }, {
        sequelize,
        modelName: 'MonthlySummaries',
        tableName: 'monthly_summaries',
        timestamps: false,
        underscored: true,
    });
    MonthlySummaries.associate = (models) => {
        MonthlySummaries.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'summary_user',
        });
    };
    return MonthlySummaries;
}