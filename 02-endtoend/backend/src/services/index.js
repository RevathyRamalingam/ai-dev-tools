import { User, Problem, Interview, Solution, Message } from '../models/index.js';

export class UserService {
  static async createUser(userData) {
    return User.create(userData);
  }

  static async getUserByEmail(email) {
    return User.findOne({ where: { email } });
  }

  static async getUserById(id) {
    return User.findByPk(id);
  }

  static async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user.update(data);
  }
}

export class ProblemService {
  static async createProblem(problemData) {
    return Problem.create(problemData);
  }

  static async getProblemById(id) {
    return Problem.findByPk(id);
  }

  static async getAllProblems(options = {}) {
    const { limit = 10, offset = 0, difficulty = null } = options;
    const where = difficulty ? { difficulty } : {};
    return Problem.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }

  static async updateProblem(id, data) {
    const problem = await Problem.findByPk(id);
    if (!problem) return null;
    return problem.update(data);
  }
}

export class InterviewService {
  static async createInterview(interviewData) {
    return Interview.create(interviewData);
  }

  static async getInterviewById(id) {
    return Interview.findByPk(id, {
      include: ['interviewer', 'candidate', 'problem'],
    });
  }

  static async getUserInterviews(userId) {
    return Interview.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { interviewerId: userId },
          { candidateId: userId },
        ],
      },
      include: ['interviewer', 'candidate', 'problem'],
    });
  }

  static async updateInterview(id, data) {
    const interview = await Interview.findByPk(id);
    if (!interview) return null;
    return interview.update(data);
  }
}

export class SolutionService {
  static async createSolution(solutionData) {
    return Solution.create(solutionData);
  }

  static async getSolutionById(id) {
    return Solution.findByPk(id);
  }

  static async getInterviewSolutions(interviewId) {
    return Solution.findAll({
      where: { interviewId },
      include: ['user', 'problem'],
    });
  }

  static async updateSolution(id, data) {
    const solution = await Solution.findByPk(id);
    if (!solution) return null;
    return solution.update(data);
  }
}

export class MessageService {
  static async createMessage(messageData) {
    return Message.create(messageData);
  }

  static async getInterviewMessages(interviewId) {
    return Message.findAll({
      where: { interviewId },
      include: ['sender'],
      order: [['createdAt', 'ASC']],
    });
  }
}

export default {
  UserService,
  ProblemService,
  InterviewService,
  SolutionService,
  MessageService,
};
