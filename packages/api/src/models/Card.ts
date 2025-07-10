import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Card extends Model {
  public id!: number;
  public type!: 'truth' | 'dare';
  public content!: string;
  public level!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Card.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      // Utilizando ENUM para restringir os tipos de cartas
      type: DataTypes.ENUM('truth', 'dare'),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(500), // Definindo um tamanho máximo para o conteúdo
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'Card',
    tableName: 'cards',
    timestamps: true, // Habilita createdAt e updatedAt
  },
);

export default Card;
