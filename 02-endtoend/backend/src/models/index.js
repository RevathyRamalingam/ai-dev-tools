import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('candidate', 'interviewer', 'admin'),
    defaultValue: 'candidate',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  underscored: true,
});

export const Problem = sequelize.define('Problem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  sampleInput: {
    type: DataTypes.TEXT,
  },
  sampleOutput: {
    type: DataTypes.TEXT,
  },
  testCases: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  timestamps: true,
  underscored: true,
});

export const Interview = sequelize.define('Interview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  interviewerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  problemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
}, {
  timestamps: true,
  underscored: true,
});

export const Solution = sequelize.define('Solution', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  interviewId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  problemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'wrong_answer', 'runtime_error', 'timeout'),
    defaultValue: 'pending',
  },
  testResults: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  timestamps: true,
  underscored: true,
});

export const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  interviewId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  messageType: {
    type: DataTypes.ENUM('chat', 'code_update', 'system'),
    defaultValue: 'chat',
  },
}, {
  timestamps: true,
  underscored: true,
});

// Define associations
User.hasMany(Interview, { as: 'interviewsAsInterviewer', foreignKey: 'interviewerId' });
User.hasMany(Interview, { as: 'interviewsAsCandidate', foreignKey: 'candidateId' });
User.hasMany(Solution, { foreignKey: 'userId' });
User.hasMany(Message, { foreignKey: 'senderId' });

Problem.hasMany(Interview, { foreignKey: 'problemId' });
Problem.hasMany(Solution, { foreignKey: 'problemId' });

Interview.belongsTo(User, { as: 'interviewer', foreignKey: 'interviewerId' });
Interview.belongsTo(User, { as: 'candidate', foreignKey: 'candidateId' });
Interview.belongsTo(Problem, { foreignKey: 'problemId' });
Interview.hasMany(Solution, { foreignKey: 'interviewId' });
Interview.hasMany(Message, { foreignKey: 'interviewId' });

Solution.belongsTo(Interview, { foreignKey: 'interviewId' });
Solution.belongsTo(Problem, { foreignKey: 'problemId' });
Solution.belongsTo(User, { foreignKey: 'userId' });

Message.belongsTo(Interview, { foreignKey: 'interviewId' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });

export default {
  User,
  Problem,
  Interview,
  Solution,
  Message,
};
