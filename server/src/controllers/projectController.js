import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  try {
    const {
      projectName,
      clientName,
      startDate,
      endDate,
      status,
      priority,
      notes,
      assignedEmployees
    } = req.body;

    if (!projectName || !clientName || !startDate || !status) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const assignedList =
      req.user.role === 'admin'
        ? Array.isArray(assignedEmployees)
          ? assignedEmployees
          : []
        : [req.user._id];

    const project = await Project.create({
      name: projectName,
      clientName,
      startDate,
      endDate: endDate || null,
      status,
      priority: priority || 'medium',
      notes: notes || '',
      assignedEmployees: assignedList
    });

    const populated = await Project.findById(project._id).populate(
      'assignedEmployees',
      'name email team designation'
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error('CREATE PROJECT ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const filter =
      req.user.role === 'admin' ? {} : { assignedEmployees: req.user._id };

    const projects = await Project.find(filter)
      .populate('assignedEmployees', 'name email team designation')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('GET PROJECTS ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const {
      projectName,
      clientName,
      startDate,
      endDate,
      status,
      priority,
      notes,
      assignedEmployees
    } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (
      req.user.role !== 'admin' &&
      !project.assignedEmployees.some(
        (empId) => empId.toString() === req.user._id.toString()
      )
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'admin') {
      project.name = projectName ?? project.name;
      project.clientName = clientName ?? project.clientName;
      project.startDate = startDate ?? project.startDate;
      project.endDate = endDate ?? project.endDate;
      project.status = status ?? project.status;
      project.priority = priority ?? project.priority;
      project.notes = notes ?? project.notes;

      if (Array.isArray(assignedEmployees)) {
        project.assignedEmployees = assignedEmployees;
      }
    } else {
      project.status = status ?? project.status;
    }

    const updated = await project.save();

    const populated = await Project.findById(updated._id).populate(
      'assignedEmployees',
      'name email team designation'
    );

    res.json(populated);
  } catch (error) {
    console.error('UPDATE PROJECT ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('DELETE PROJECT ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};