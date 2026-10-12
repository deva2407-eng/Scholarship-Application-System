const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Make sure authentication middleware has already
        // attached the user's information to req.user
        if (!req.user) {
            return res.status(401).json({
                message: "User is not authenticated"
            });
        }

        // Check whether user's role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. You do not have permission to access this resource."
            });
        }

        next();
    };
};

module.exports = authorizeRoles;