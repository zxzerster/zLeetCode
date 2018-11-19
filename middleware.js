export default ({ getState }) => next => action => {
    if (typeof action === 'function') {
        const { session } = getState();

        if (!session) {
            return next(action);
        }

        return next(action(session));
    }

    return next(action);
};
