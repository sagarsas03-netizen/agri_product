/**
 * Joi validation middleware factory
 * Usage: router.post('/route', validate(schema), controller)
 */
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const message = error.details.map((d) => d.message.replace(/"/g, '')).join(', ');
        return res.status(400).json({ success: false, message });
    }
    next();
};

module.exports = validate;
