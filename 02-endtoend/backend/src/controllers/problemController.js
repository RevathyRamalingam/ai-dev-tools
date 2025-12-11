import { ProblemService } from '../services/index.js';

export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, tags, sampleInput, sampleOutput, testCases } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: 'Title, description, and difficulty are required' });
    }

    const problem = await ProblemService.createProblem({
      title,
      description,
      difficulty,
      tags: tags || [],
      sampleInput: sampleInput || '',
      sampleOutput: sampleOutput || '',
      testCases: testCases || [],
    });

    res.status(201).json({
      message: 'Problem created successfully',
      problem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await ProblemService.getProblemById(id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProblems = async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty } = req.query;
    const offset = (page - 1) * limit;

    const result = await ProblemService.getAllProblems({
      limit: parseInt(limit),
      offset: parseInt(offset),
      difficulty: difficulty || null,
    });

    res.json({
      problems: result.rows,
      total: result.count,
      page: parseInt(page),
      pages: Math.ceil(result.count / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await ProblemService.updateProblem(id, req.body);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({
      message: 'Problem updated successfully',
      problem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createProblem,
  getProblem,
  getProblems,
  updateProblem,
};
