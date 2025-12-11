import { InterviewService, SolutionService } from '../services/index.js';
import CodeExecutionService from '../services/codeExecutor.js';

export const createInterview = async (req, res) => {
  try {
    const { problemId, candidateId, scheduledAt } = req.body;
    const interviewerId = req.user.id;

    if (!problemId || !scheduledAt) {
      return res.status(400).json({ message: 'problemId and scheduledAt are required' });
    }

    const interview = await InterviewService.createInterview({
      interviewerId,
      candidateId: candidateId || null,
      problemId,
      scheduledAt,
    });

    res.status(201).json({
      message: 'Interview created successfully',
      interview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await InterviewService.getInterviewById(id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserInterviews = async (req, res) => {
  try {
    const interviews = await InterviewService.getUserInterviews(req.user.id);
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await InterviewService.updateInterview(id, req.body);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({
      message: 'Interview updated successfully',
      interview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const executeCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    const result = await CodeExecutionService.executeCode(code, language, input);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language, problemId } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({ message: 'Code, language, and problemId are required' });
    }

    const solution = await SolutionService.createSolution({
      interviewId: id,
      problemId,
      userId: req.user.id,
      code,
      language,
    });

    res.status(201).json({
      message: 'Solution submitted successfully',
      solution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInterviewSolutions = async (req, res) => {
  try {
    const { id } = req.params;
    const solutions = await SolutionService.getInterviewSolutions(id);
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createInterview,
  getInterview,
  getUserInterviews,
  updateInterview,
  executeCode,
  submitSolution,
  getInterviewSolutions,
};
