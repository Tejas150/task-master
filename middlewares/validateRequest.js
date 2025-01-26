const { celebrate, Joi, errors } = require("celebrate");

const validateRegister = celebrate({
  body: Joi.object({
    username: Joi.string().required().messages({
      "string.empty": "Username cannot be empty.",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email cannot be empty.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.empty": "Password cannot be empty.",
    }),
    profile: Joi.object({
      firstName: Joi.string().optional().messages({
        "string.base": "First name must be a string.",
      }),
      lastName: Joi.string().optional().messages({
        "string.base": "Last name must be a string.",
      }),
      bio: Joi.string().optional().messages({
        "string.base": "Bio must be a string.",
      }),
      location: Joi.string().optional().messages({
        "string.base": "Location must be a string.",
      }),
      phoneNumber: Joi.string().optional().messages({
        "string.base": "Phone number must be a string.",
      }),
    }).optional(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object({
    identifier: Joi.string().required().messages({
      "string.empty": "Email or username cannot be empty.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.empty": "Password cannot be empty.",
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object({
    profile: Joi.object({
      firstName: Joi.string().optional().messages({
        "string.base": "First name must be a string.",
      }),
      lastName: Joi.string().optional().messages({
        "string.base": "Last name must be a string.",
      }),
      bio: Joi.string().optional().messages({
        "string.base": "Bio must be a string.",
      }),
      location: Joi.string().optional().messages({
        "string.base": "Location must be a string.",
      }),
      phoneNumber: Joi.string().optional().messages({
        "string.base": "Phone number must be a string.",
      }),
    }).required().messages({
      "object.base": "Profile must be an object.",
      "any.required": "Profile data is required."
    }),
  }).required().messages({
    "object.base": "Request body must be an object.",
    "any.required": "Request body is required."
  }),
});

const validateCreateTask = celebrate({
  body: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title cannot be empty.",
    }),
    description: Joi.string().optional().messages({
      "string.base": "Description must be a string.",
    }),
    dueDate: Joi.date().optional().messages({
      "date.base": "Due date must be a valid date.",
    }),
    assignedTo: Joi.string().optional().messages({
      "string.base": "Assigned to must be a string.",
    }),
  }),
});

const validateUpdateTaskStatus = celebrate({
  body: Joi.object({
    taskId: Joi.string().required().messages({
      "string.empty": "Task ID cannot be empty.",
    }),
    status: Joi.string().valid('open', 'in-progress', 'completed').required().messages({
      "any.only": "Status must be one of 'open', 'in-progress', or 'completed'.",
      "string.empty": "Status cannot be empty.",
    }),
  }),
});

const validateAssignTask = celebrate({
  body: Joi.object({
    taskId: Joi.string().required().messages({
      "string.empty": "Task ID cannot be empty.",
    }),
    assignedTo: Joi.string().required().messages({
      "string.empty": "Assigned to cannot be empty.",
    }),
  }),
});

const validateAddComment = celebrate({
  body: Joi.object({
    taskId: Joi.string().required().messages({
      "string.empty": "Task ID cannot be empty.",
    }),
    comment: Joi.string().required().messages({
      "string.empty": "Comment cannot be empty.",
    }),
  }),
});

const validateAddAttachment = celebrate({
  body: Joi.object({
    taskId: Joi.string().required().messages({
      "string.empty": "Task ID cannot be empty.",
    }),
    attachment: Joi.string().required().messages({
      "string.empty": "Attachment cannot be empty.",
    }),
  }),
});

const validateCreateProject = celebrate({
  body: Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Project name cannot be empty.",
    }),
    description: Joi.string().optional().messages({
      "string.base": "Description must be a string.",
    }),
  }),
});

const validateInviteMember = celebrate({
  body: Joi.object({
    projectId: Joi.string().required().messages({
      "string.empty": "Project ID cannot be empty.",
    }),
    memberId: Joi.string().required().messages({
      "string.empty": "Member ID cannot be empty.",
    }),
  }),
});

const validateMakeManager = celebrate({
  body: Joi.object({
    projectId: Joi.string().required().messages({
      "string.empty": "Project ID cannot be empty.",
    }),
    memberId: Joi.string().required().messages({
      "string.empty": "Member ID cannot be empty.",
    }),
  }),
});

module.exports = { 
  validateLogin, 
  validateRegister, 
  validateId, 
  validateUpdateProfile, 
  validateCreateTask, 
  validateUpdateTaskStatus, 
  validateAssignTask, 
  validateAddComment, 
  validateAddAttachment, 
  validateCreateProject, 
  validateInviteMember, 
  validateMakeManager,
  errors 
};
