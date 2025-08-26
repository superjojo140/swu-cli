export function notFoundRoute(req, res, next) {
    const error = new Error("Not found");
    (error as any).status = 404;
    next(error);
}

export function errorHandler(error, req, res, next) {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status || 500,
            url: req.url,
        }
    });
}