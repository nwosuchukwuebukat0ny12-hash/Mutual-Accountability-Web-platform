const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const issues = error.issues || error.errors;
    if (issues) {
      return res.status(400).json({
        success: false,
        errors: issues.map((e) => ({
          field: e.path[0] || 'body',
          message: e.message,
        })),
      });
    }
    
    // Fallback if the error isn't a ZodError
    console.error('Validation Middleware Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Validation failed',
    });
  }
};

module.exports = validate;
