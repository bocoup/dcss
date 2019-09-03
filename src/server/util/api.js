exports.apiError = (res, error) => {
    const { status = 400, message } = error;
    // TODO: turn on stack in DEV
    return res.status(status).json({ error: true, message });
}